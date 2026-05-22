#!/usr/bin/env python3
"""
sync_nra_leads.py
NRA Show 2026 lead pipeline — MailerLite group import + Shopify customer tagging.

Usage:
    export MAILERLITE_API_KEY=...
    export SHOPIFY_ADMIN_API_ACCESS_TOKEN=...
    export SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com
    python3 sync_nra_leads.py

Dependencies:
    pip install requests
"""

import csv
import logging
import os
import sys
import time
from pathlib import Path

import requests

# ── Constants ─────────────────────────────────────────────────────────────────

CSV_FILE = "leads-NRA261-2026-05-22.csv"
MAILERLITE_GROUP_NAME = "NRA_Show_Leads_2026"
MAILERLITE_API_BASE = "https://connect.mailerlite.com/api"
SHOPIFY_TAG = "NRA_2026_Attendee"
SHOPIFY_API_VERSION = "2024-01"
MAILERLITE_BATCH_SIZE = 200   # max subscribers per import request
SHOPIFY_REQUEST_GAP = 0.55    # seconds between Shopify calls (~1.8 req/s, under the 2/s REST limit)

# ── Logging ───────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("sync_nra_leads.log", encoding="utf-8"),
    ],
)
log = logging.getLogger(__name__)

# ── Environment ───────────────────────────────────────────────────────────────

def load_env() -> dict[str, str]:
    keys = [
        "MAILERLITE_API_KEY",
        "SHOPIFY_ADMIN_API_ACCESS_TOKEN",
        "SHOPIFY_STORE_DOMAIN",
    ]
    env = {k: os.environ.get(k, "").strip() for k in keys}
    missing = [k for k, v in env.items() if not v]
    if missing:
        log.error("Required environment variables not set: %s", ", ".join(missing))
        sys.exit(1)
    return env

# ── CSV Parsing ───────────────────────────────────────────────────────────────

REQUIRED_COLUMNS = {
    "FirstName", "LastName", "Email", "Company",
    "Title", "City", "StateCode", "ZipCode",
}


def _clean_zip(raw: str) -> str:
    # CSV export wraps zip codes in single quotes to prevent Excel auto-formatting
    return raw.strip().strip("'")


def parse_csv(path: str) -> list[dict]:
    csv_path = Path(path)
    if not csv_path.exists():
        log.error("CSV file not found: %s", csv_path.resolve())
        sys.exit(1)

    records: list[dict] = []
    skipped = 0

    with csv_path.open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)

        # Validate expected columns are present
        actual_cols = set(reader.fieldnames or [])
        missing_cols = REQUIRED_COLUMNS - actual_cols
        if missing_cols:
            log.error("CSV is missing expected columns: %s", missing_cols)
            sys.exit(1)

        for row_num, row in enumerate(reader, start=2):
            email = row["Email"].strip().lower()
            if not email:
                log.warning("Row %d: empty email — skipping", row_num)
                skipped += 1
                continue

            records.append({
                "email":      email,
                "first_name": row["FirstName"].strip(),
                "last_name":  row["LastName"].strip(),
                "company":    row["Company"].strip(),
                "title":      row["Title"].strip(),
                "city":       row["City"].strip(),
                "state":      row["StateCode"].strip(),
                "zip":        _clean_zip(row["ZipCode"]),
            })

    log.info("CSV parsed — %d valid records, %d skipped (no email)", len(records), skipped)
    return records

# ── MailerLite Client ─────────────────────────────────────────────────────────

class MailerLiteClient:
    """Thin wrapper around the MailerLite v2 REST API."""

    def __init__(self, api_key: str) -> None:
        self._session = requests.Session()
        self._session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        })

    def _get(self, path: str, params: dict | None = None) -> dict:
        url = f"{MAILERLITE_API_BASE}{path}"
        r = self._session.get(url, params=params, timeout=30)
        r.raise_for_status()
        return r.json()

    def _post(self, path: str, payload: dict) -> dict:
        url = f"{MAILERLITE_API_BASE}{path}"
        r = self._session.post(url, json=payload, timeout=60)
        r.raise_for_status()
        return r.json()

    def get_or_create_group(self, name: str) -> str:
        """Return the group ID for `name`, creating it if it does not exist."""
        page = 1
        while True:
            data = self._get("/groups", params={"limit": 25, "page": page})
            for group in data.get("data", []):
                if group["name"] == name:
                    log.info("MailerLite group found: '%s' (id=%s)", name, group["id"])
                    return str(group["id"])

            meta = data.get("meta", {})
            if page >= meta.get("last_page", 1):
                break
            page += 1

        result = self._post("/groups", {"name": name})
        group_id = str(result["data"]["id"])
        log.info("MailerLite group created: '%s' (id=%s)", name, group_id)
        return group_id

    @staticmethod
    def _build_subscriber(record: dict) -> dict:
        return {
            "email": record["email"],
            "fields": {
                "name":       record["first_name"],
                "last_name":  record["last_name"],
                "company":    record["company"],
                "city":       record["city"],
                "state":      record["state"],
                "z_ip_code":  record["zip"],
            },
            # 'Title' maps to a custom text field; create the field in MailerLite
            # dashboard (Settings > Fields) with key 'job_title' before running.
            "custom_attributes": {
                "job_title": record["title"],
            },
        }

    def batch_import(self, records: list[dict], group_id: str) -> None:
        """Send subscribers in chunks, attach all to `group_id`."""
        total = len(records)
        imported_total = 0

        for start in range(0, total, MAILERLITE_BATCH_SIZE):
            chunk = records[start : start + MAILERLITE_BATCH_SIZE]
            payload = {
                "subscribers": [self._build_subscriber(r) for r in chunk],
                "groups": [group_id],
            }

            result = self._post("/subscribers/import", payload)
            # MailerLite returns { "imported": { "count": N }, "updated": { "count": N }, ... }
            batch_imported = result.get("imported", {}).get("count", 0)
            batch_updated = result.get("updated", {}).get("count", 0)
            imported_total += batch_imported + batch_updated

            log.info(
                "MailerLite batch %d–%d: %d imported, %d updated",
                start + 1,
                start + len(chunk),
                batch_imported,
                batch_updated,
            )

        log.info("MailerLite import complete — %d/%d records processed", imported_total, total)

# ── Shopify Client ────────────────────────────────────────────────────────────

class ShopifyClient:
    """Thin wrapper around the Shopify Admin REST API."""

    def __init__(self, store_domain: str, access_token: str) -> None:
        self._base = f"https://{store_domain}/admin/api/{SHOPIFY_API_VERSION}"
        self._session = requests.Session()
        self._session.headers.update({
            "X-Shopify-Access-Token": access_token,
            "Content-Type": "application/json",
        })

    def _get(self, path: str, params: dict | None = None, retries: int = 4) -> dict:
        url = f"{self._base}{path}"
        delay = 1.0
        for attempt in range(retries):
            r = self._session.get(url, params=params, timeout=30)
            if r.status_code == 429:
                wait = float(r.headers.get("Retry-After", delay))
                log.warning("Shopify rate limit — waiting %.1fs (attempt %d)", wait, attempt + 1)
                time.sleep(wait)
                delay = min(delay * 2, 32.0)
                continue
            r.raise_for_status()
            return r.json()
        raise RuntimeError(f"Shopify GET {path} failed after {retries} retries")

    def _put(self, path: str, payload: dict, retries: int = 4) -> dict:
        url = f"{self._base}{path}"
        delay = 1.0
        for attempt in range(retries):
            r = self._session.put(url, json=payload, timeout=30)
            if r.status_code == 429:
                wait = float(r.headers.get("Retry-After", delay))
                log.warning("Shopify rate limit — waiting %.1fs (attempt %d)", wait, attempt + 1)
                time.sleep(wait)
                delay = min(delay * 2, 32.0)
                continue
            r.raise_for_status()
            return r.json()
        raise RuntimeError(f"Shopify PUT {path} failed after {retries} retries")

    def find_customer_by_email(self, email: str) -> dict | None:
        data = self._get("/customers/search.json", params={"query": f"email:{email}", "limit": 1})
        customers = data.get("customers", [])
        return customers[0] if customers else None

    def apply_tag(self, customer: dict) -> bool:
        """Add SHOPIFY_TAG to customer if not already present. Returns True if tag was added."""
        existing = [t.strip() for t in customer.get("tags", "").split(",") if t.strip()]
        if SHOPIFY_TAG in existing:
            return False
        existing.append(SHOPIFY_TAG)
        self._put(
            f"/customers/{customer['id']}.json",
            {"customer": {"id": customer["id"], "tags": ", ".join(existing)}},
        )
        return True

    def process_leads(self, records: list[dict]) -> None:
        total = len(records)
        counts = {"found": 0, "tagged": 0, "already_tagged": 0, "not_found": 0, "errors": 0}

        for i, record in enumerate(records, start=1):
            email = record["email"]
            try:
                customer = self.find_customer_by_email(email)
                if customer:
                    counts["found"] += 1
                    added = self.apply_tag(customer)
                    if added:
                        counts["tagged"] += 1
                        log.info("[%d/%d] Shopify — tagged: %s", i, total, email)
                    else:
                        counts["already_tagged"] += 1
                        log.debug("[%d/%d] Shopify — already tagged: %s", i, total, email)
                else:
                    counts["not_found"] += 1
                    log.debug("[%d/%d] Shopify — no customer found: %s", i, total, email)
            except Exception as exc:
                counts["errors"] += 1
                log.error("[%d/%d] Shopify error for %s: %s", i, total, email, exc)

            # Throttle to stay within Shopify's REST bucket (2 req/s)
            time.sleep(SHOPIFY_REQUEST_GAP)

        log.info(
            "Shopify complete — found: %d | tagged: %d | already tagged: %d | not found: %d | errors: %d",
            counts["found"],
            counts["tagged"],
            counts["already_tagged"],
            counts["not_found"],
            counts["errors"],
        )

# ── Entry Point ───────────────────────────────────────────────────────────────

def main() -> None:
    log.info("=== NRA Show 2026 Lead Sync — START ===")

    env = load_env()
    records = parse_csv(CSV_FILE)

    if not records:
        log.error("No valid records to process. Exiting.")
        sys.exit(1)

    # ── MailerLite ──
    log.info("--- MailerLite phase ---")
    ml = MailerLiteClient(env["MAILERLITE_API_KEY"])
    group_id = ml.get_or_create_group(MAILERLITE_GROUP_NAME)
    ml.batch_import(records, group_id)

    # ── Shopify ──
    log.info("--- Shopify phase ---")
    shopify = ShopifyClient(
        store_domain=env["SHOPIFY_STORE_DOMAIN"],
        access_token=env["SHOPIFY_ADMIN_API_ACCESS_TOKEN"],
    )
    shopify.process_leads(records)

    log.info("=== NRA Show 2026 Lead Sync — COMPLETE ===")


if __name__ == "__main__":
    main()
