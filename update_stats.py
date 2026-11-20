import json, re, sys, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone

USER = "asuf10ppy"
UA = {"User-Agent": "Mozilla/5.0 (stats-bot)"}

def get(url, data=None, headers=None):
    req = urllib.request.Request(url, data=data, headers={**UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read().decode()

def codeforces():
    info = json.loads(get(f"https://codeforces.com/api/user.info?handles={USER}"))["result"][0]
    subs = json.loads(get(f"https://codeforces.com/api/user.status?handle={USER}"))["result"]
    solved = {(s["problem"].get("contestId"), s["problem"]["index"]) for s in subs if s.get("verdict") == "OK"}
    return {"rating": info.get("rating"), "maxRating": info.get("maxRating"),
            "rank": info.get("rank", ""), "solved": len(solved)}

def leetcode():
    q = "query($u:String!){matchedUser(username:$u){submitStatsGlobal{acSubmissionNum{difficulty count}}}}"
    body = json.dumps({"query": q, "variables": {"u": USER}}).encode()
    d = json.loads(get("https://leetcode.com/graphql", body,
                       {"Content-Type": "application/json", "Referer": "https://leetcode.com"}))
    rows = {r["difficulty"]: r["count"] for r in d["data"]["matchedUser"]["submitStatsGlobal"]["acSubmissionNum"]}
    return {"solved": rows["All"], "easy": rows["Easy"], "medium": rows["Medium"], "hard": rows["Hard"]}

def tryhackme():
    # Unofficial endpoint: may change. If it breaks, set values under "override" in stats.json.
    d = json.loads(get(f"https://tryhackme.com/api/v2/public-profile?username={USER}"))
    d = d.get("data", d)
    return {"rank": d.get("rank"), "rooms": d.get("completedRoomsNumber"), "badges": d.get("badgesNumber")}

def youtube():
    html = get(f"https://www.youtube.com/@{USER}")
    cid = re.search(r'"(?:channelId|externalId)":"(UC[\w-]{22})"', html).group(1)
    root = ET.fromstring(get(f"https://www.youtube.com/feeds/videos.xml?channel_id={cid}"))
    ns = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    return [{"id": e.find("yt:videoId", ns).text, "title": e.find("a:title", ns).text,
             "published": e.find("a:published", ns).text[:10]} for e in root.findall("a:entry", ns)[:6]]

def merge(a, b):
    for k, v in b.items():
        if isinstance(v, dict) and isinstance(a.get(k), dict):
            merge(a[k], v)
        else:
            a[k] = v

try:
    data = json.load(open("stats.json"))
except Exception:
    data = {}

for name, fn in [("codeforces", codeforces), ("leetcode", leetcode), ("tryhackme", tryhackme), ("youtube", youtube)]:
    try:
        res = fn()
        if isinstance(res, dict):
            data.setdefault(name, {}).update({k: v for k, v in res.items() if v is not None})
        elif res:
            data[name] = res
    except Exception as e:
        print(f"{name} failed, keeping last good data: {e}", file=sys.stderr)

merge(data, data.get("override", {}))
data["updated"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
json.dump(data, open("stats.json", "w"), indent=2)
