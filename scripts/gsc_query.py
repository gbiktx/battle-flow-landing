#!/usr/bin/env python3
"""Query Google Search Console Search Analytics for battleflow.app.

Auth: a service-account JSON key, path given via env GSC_KEY.
The service account must be added as a (restricted) user on the
GSC property. Property is the domain property sc-domain:battleflow.app.

Usage examples:
  GSC_KEY=/path/key.json python3 scripts/gsc_query.py \
      --days 90 --dims query,page,country --limit 25000 --out out.csv
  GSC_KEY=... python3 scripts/gsc_query.py --days 28 --dims query --page-filter /ja/iv-calculator/

Notes:
  - GSC data lags ~2-3 days and goes back ~16 months.
  - rowLimit max is 25000 per request; we paginate with startRow.
"""
import argparse, csv, os, sys, warnings, datetime as dt
warnings.filterwarnings("ignore")
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

SITE = "sc-domain:battleflow.app"
API = f"https://searchconsole.googleapis.com/webmasters/v3/sites/{SITE.replace(':', '%3A')}/searchAnalytics/query"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]


def session():
    key = os.environ.get("GSC_KEY")
    if not key or not os.path.exists(key):
        sys.exit("Set GSC_KEY to the service-account JSON key path.")
    creds = service_account.Credentials.from_service_account_file(key, scopes=SCOPES)
    return AuthorizedSession(creds)


def run(s, start, end, dims, limit, page_filter):
    rows, start_row = [], 0
    while True:
        body = {
            "startDate": start, "endDate": end,
            "dimensions": dims,
            "rowLimit": min(25000, limit - len(rows)),
            "startRow": start_row,
        }
        if page_filter:
            body["dimensionFilterGroups"] = [{
                "filters": [{"dimension": "page", "operator": "contains", "expression": page_filter}]
            }]
        r = s.post(API, json=body)
        if r.status_code != 200:
            sys.exit(f"{r.status_code}: {r.text[:500]}")
        batch = r.json().get("rows", [])
        rows.extend(batch)
        if len(batch) < body["rowLimit"] or len(rows) >= limit:
            break
        start_row += len(batch)
    return rows


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--days", type=int, default=90)
    p.add_argument("--dims", default="query,page", help="comma list: query,page,country,device,date")
    p.add_argument("--limit", type=int, default=25000)
    p.add_argument("--page-filter", default=None, help="substring match on page URL")
    p.add_argument("--out", default=None, help="write CSV to this path")
    p.add_argument("--top", type=int, default=30, help="rows to print to stdout")
    a = p.parse_args()

    end = dt.date.today() - dt.timedelta(days=2)
    start = end - dt.timedelta(days=a.days)
    dims = [d.strip() for d in a.dims.split(",") if d.strip()]
    s = session()
    rows = run(s, start.isoformat(), end.isoformat(), dims, a.limit, a.page_filter)
    rows.sort(key=lambda x: x.get("impressions", 0), reverse=True)

    header = dims + ["clicks", "impressions", "ctr", "position"]
    if a.out:
        with open(a.out, "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(header)
            for x in rows:
                k = x.get("keys", [])
                w.writerow(k + [x["clicks"], x["impressions"], round(x["ctr"] * 100, 2), round(x["position"], 2)])
        print(f"wrote {len(rows)} rows -> {a.out}  ({start} .. {end})")
    print("\t".join(header))
    for x in rows[: a.top]:
        k = x.get("keys", [])
        print("\t".join(map(str, k + [x["clicks"], x["impressions"], f"{x['ctr']*100:.2f}%", f"{x['position']:.1f}"])))


if __name__ == "__main__":
    main()
