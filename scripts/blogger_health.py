#!/usr/bin/env python3
"""YYH read-only Blogger health audit. Never publishes or modifies Blogger."""
import argparse
import datetime
import html.parser
import json
import re
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

BASE="https://yinyangyohackers.blogspot.com"
HEADERS={"User-Agent":"YYH-HealthAudit/1.0 (https://github.com/vishwasaithalz/YYYH)"}
POST_PATTERN=re.compile(r"/20\d\d/\d\d/[^/?#]+\.html$")

def fetch(url):
    start=time.monotonic()
    try:
        req=urllib.request.Request(url,headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as response:
            content=response.read(3000001)
            return {"code":response.status,"ms":round((time.monotonic()-start)*1000),
                    "bytes":len(content),"text":content[:3000000].decode("utf-8","replace"),
                    "truncated":len(content)>3000000}
    except urllib.error.HTTPError as e:
        return {"code":e.code,"error":str(e),"ms":round((time.monotonic()-start)*1000)}
    except Exception as e:
        return {"code":None,"error":str(e),"ms":round((time.monotonic()-start)*1000)}

class Page(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.headings=[]; self.current=None; self.buffer=[]
        self.images=[]; self.meta=[]; self.canonical=[]; self.links=[]
    def handle_starttag(self, tag, attributes):
        a=dict(attributes)
        if re.fullmatch(r"h[1-6]",tag):
            self.current=int(tag[1]);self.buffer=[]
        if tag=="img":self.images.append(a)
        if tag=="meta" and a.get("name","").lower()=="description":
            self.meta.append(a.get("content",""))
        if tag=="link" and a.get("rel","").lower()=="canonical":
            self.canonical.append(a.get("href",""))
        if tag=="a":self.links.append(a)
    def handle_data(self,data):
        if self.current is not None:self.buffer.append(data)
    def handle_endtag(self,tag):
        if self.current is not None and tag=="h"+str(self.current):
            self.headings.append((self.current," ".join("".join(self.buffer).split())[:100]))
            self.current=None

def locs(xml):
    try:
        return [e.text.strip() for e in ET.fromstring(xml).iter()
                if e.tag.split("}")[-1]=="loc" and e.text]
    except ET.ParseError:return []

def inspect(url, response):
    item={"url":url,"status":response["code"],"fetch_elapsed_ms_not_ttfb":response["ms"],
          "bytes":response.get("bytes"),"issues":[]}
    if response["code"]!=200:
        item["issues"].append("HTTP request failed: "+str(response.get("error",response["code"])))
        return item
    page=Page()
    page.feed(response["text"])
    h1=[h for h in page.headings if h[0]==1]
    skips=[]
    for prev,next_ in zip(page.headings,page.headings[1:]):
        if next_[0]>prev[0]+1:skips.append("H%s to H%s: %s"%(prev[0],next_[0],next_[1]))
    img_wo_alt=sum(not a.get("alt","").strip() for a in page.images)
    item.update({"headings_skipped":skips[:8],"image_count":len(page.images),
                 "missing_image_alt":img_wo_alt,"meta_description_count":len(page.meta),
                 "canonical_count":len(page.canonical)})
    if len(h1)!=1:item["issues"].append("H1 count "+str(len(h1)))
    if skips:item["issues"].append("Heading level skipped")
    if len(page.meta)!=1:item["issues"].append("Meta description count "+str(len(page.meta)))
    if not page.canonical:item["issues"].append("No canonical link in returned HTML")
    if img_wo_alt:item["issues"].append(str(img_wo_alt)+" HTML images missing alt text")
    if not page.images:item["issues"].append("No img elements in HTML; check real article images")
    if url.rstrip("/") == BASE and response.get("bytes",0)>350000:
        item["issues"].append("Homepage HTML is larger than 350 KB")
    return item

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--output",default="reports")
    ap.add_argument("--post-limit",type=int,default=75)
    args=ap.parse_args()
    base=BASE
    start=datetime.datetime.now(datetime.timezone.utc).isoformat()
    home=fetch(base+"/"); sitemap=fetch(base+"/sitemap.xml")
    pages=fetch(base+"/sitemap-pages.xml"); robots=fetch(base+"/robots.txt")
    urls=sorted({u.split("?")[0] for u in locs(sitemap.get("text",""))
                 if POST_PATTERN.fullmatch(urlparse(u).path)})
    declared_pages=locs(pages.get("text","")) if pages["code"]==200 else None
    checks=[]
    for index,url in enumerate(urls[:max(0,min(150,args.post_limit))]):
        if index:time.sleep(0.3)
        checks.append(inspect(url,fetch(url)))
    target_pages={k:(None if declared_pages is None else v in declared_pages) for k,v in {
        "Privacy Policy":base+"/p/privacy-policy.html",
        "Terms and Conditions":base+"/p/terms-and-conditions.html"}.items()}
    result={"checked_utc":start,"source":base,"read_only":True,
            "homepage":inspect(base,home),"robots_status":robots["code"],
            "sitemap_status":sitemap["code"],"pages_sitemap_status":pages["code"],
            "post_urls_found":len(urls),"post_checks":checks,
            "legal_pages_in_sitemap":target_pages,
            "notes":["Fetch time is not Lighthouse, TTFB, or Core Web Vitals.",
                     "No Blogger content, themes or settings were changed."]}
    output=Path(args.output);output.mkdir(parents=True,exist_ok=True)
    (output/"latest.json").write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    issues=sum(bool(x["issues"]) for x in checks)
    summary=[
        "# YinYangYoHackers public audit",f"UTC: {start}",
        f"Homepage HTTP: {home['code']}; sitemap HTTP: {sitemap['code']}; robots HTTP: {robots['code']}",
        f"Post URLs in sitemap: {len(urls)}; checked: {len(checks)}; with potential issues: {issues}",
        "## Homepage findings",
        *["- "+issue for issue in result["homepage"]["issues"]],
        "## Legal pages",
        *["- "+k+": "+("UNVERIFIED" if v is None else "listed" if v else "not in published-page sitemap")
          for k,v in target_pages.items()],
        "## Post findings",
        *["- "+p["url"]+": "+", ".join(p["issues"]) for p in checks if p["issues"]],
        "Note: read-only HTML/sitemap scan, not a Lighthouse score or rendered-browser test."
    ]
    (output/"latest.md").write_text("\n".join(summary)+"\n",encoding="utf-8")
    print("\n".join(summary))
    return 0 if home["code"]==200 and sitemap["code"]==200 else 1

if __name__=="__main__":
    raise SystemExit(main())
