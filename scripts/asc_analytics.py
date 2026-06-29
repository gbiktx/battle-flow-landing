#!/usr/bin/env python3
"""Pull App Store Connect analytics reports for BattleFlow (iOS ASO funnel).

Auth: an App Store Connect API key (.p8) with the Admin role. Provide via env:
  ASC_KEY_P8    path to the AuthKey_XXXX.p8 file   (keep secret, never commit)
  ASC_KEY_ID    the key id (e.g. VGJFKLJL43)
  ASC_ISSUER_ID the issuer id (uuid)
  ASC_APP_ID    the app's ASC numeric id (BattleFlow = 6738843812)

One-time setup (already done): POST an analyticsReportRequests for the app
(ONGOING for the continuous loop, ONE_TIME_SNAPSHOT for ~1yr history). Apple
then generates report files, which take ~a day to first appear.

The ASO funnel lives in:
  - category APP_STORE_ENGAGEMENT, report "App Store Discovery and Engagement"
    (Standard = impressions/page-views/source; Detailed = adds search terms)
  - category COMMERCE, report "App Downloads" (first-time downloads by territory/source)

Usage:
  python3 scripts/asc_analytics.py --status        # are reports generated yet?
  python3 scripts/asc_analytics.py --list          # list all report types
  python3 scripts/asc_analytics.py --download "App Store Discovery and Engagement Standard" \
      --granularity DAILY --out engagement.csv
"""
import os, sys, time, gzip, io, csv, argparse, warnings
warnings.filterwarnings("ignore")
import jwt, requests

B = "https://api.appstoreconnect.apple.com"


def token():
    for v in ("ASC_KEY_P8", "ASC_KEY_ID", "ASC_ISSUER_ID", "ASC_APP_ID"):
        if not os.environ.get(v):
            sys.exit(f"Set env {v}")
    key = open(os.environ["ASC_KEY_P8"]).read()
    now = int(time.time())
    return jwt.encode(
        {"iss": os.environ["ASC_ISSUER_ID"], "iat": now, "exp": now + 1000, "aud": "appstoreconnect-v1"},
        key, algorithm="ES256", headers={"kid": os.environ["ASC_KEY_ID"], "typ": "JWT"},
    )


def H():
    return {"Authorization": f"Bearer {token()}"}


def get(path, **params):
    r = requests.get(B + path, headers=H(), params=params, timeout=60)
    if r.status_code != 200:
        sys.exit(f"{r.status_code} {path}: {r.text[:300]}")
    return r.json()


def requests_for_app():
    return get(f"/v1/apps/{os.environ['ASC_APP_ID']}/analyticsReportRequests")["data"]


def all_reports():
    """All report definitions across every request on the app."""
    out = []
    for req in requests_for_app():
        d = get(f"/v1/analyticsReportRequests/{req['id']}/reports", **{"limit": 200})
        for x in d.get("data", []):
            out.append((req["attributes"]["accessType"], req["id"], x["id"], x["attributes"]))
    return out


# The ASO-relevant reports — only check these for generation status (the full
# catalog is 200+ report types, too many to poll one-by-one).
ASO_REPORTS = {
    "App Store Discovery and Engagement Standard",
    "App Store Discovery and Engagement Detailed",
    "App Downloads Standard",
    "App Downloads Detailed",
}


def cmd_status():
    reps = [r for r in all_reports() if r[3]["name"] in ASO_REPORTS]
    print(f"checking {len(reps)} ASO report(s) across {len(requests_for_app())} request(s).")
    ready = 0
    for access, _req, rid, attr in reps:
        inst = get(f"/v1/analyticsReports/{rid}/instances").get("data", [])
        state = "READY" if inst else "pending"
        if inst:
            ready += 1
            grans = ",".join(sorted({i["attributes"]["granularity"] for i in inst}))
            print(f"  {state}  [{access}] {attr['name']}  ({len(inst)} instances: {grans})")
        else:
            print(f"  {state}  [{access}] {attr['name']}")
    if not ready:
        print("  No instances generated yet — Apple is still baking. Check back in ~a day.")


def cmd_list():
    cats = {}
    for access, _req, _rid, attr in all_reports():
        cats.setdefault(attr["category"], set()).add(attr["name"])
    for c, names in sorted(cats.items()):
        print(f"\n{c}")
        for n in sorted(names):
            print(f"  - {n}")


def cmd_download(name, granularity, out):
    target = None
    for _access, _req, rid, attr in all_reports():
        if attr["name"] == name:
            target = rid
            break
    if not target:
        sys.exit(f"No report named {name!r}. Run --list.")
    instances = get(f"/v1/analyticsReports/{target}/instances",
                    **{"filter[granularity]": granularity}).get("data", [])
    if not instances:
        sys.exit(f"No {granularity} instances yet for {name!r} (still generating?).")
    rows, header = [], None
    for inst in instances:
        segs = get(f"/v1/analyticsReportInstances/{inst['id']}/segments").get("data", [])
        for s in segs:
            url = s["attributes"]["url"]
            raw = requests.get(url, timeout=120).content
            text = gzip.decompress(raw).decode("utf-8")
            rdr = csv.reader(io.StringIO(text), delimiter="\t")
            h = next(rdr)
            header = header or h
            rows.extend(rdr)
    with open(out, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print(f"wrote {len(rows)} rows -> {out}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--status", action="store_true")
    p.add_argument("--list", action="store_true")
    p.add_argument("--download")
    p.add_argument("--granularity", default="DAILY", choices=["DAILY", "WEEKLY", "MONTHLY"])
    p.add_argument("--out", default="asc_report.csv")
    a = p.parse_args()
    if a.status:
        cmd_status()
    elif a.list:
        cmd_list()
    elif a.download:
        cmd_download(a.download, a.granularity, a.out)
    else:
        p.print_help()


if __name__ == "__main__":
    main()
