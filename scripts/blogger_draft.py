#!/usr/bin/env python3
"""Manual, private Blogger draft creation. Never publicly publishes."""
import argparse,json,os,re,sys
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlencode
from urllib.request import Request,urlopen

class Post(HTMLParser):
    def __init__(self):
        super().__init__();self.img=[];self.text=[]
    def handle_starttag(self,tag,attrs):
        if tag=="img":self.img.append(dict(attrs))
    def handle_data(self,data):self.text.append(data)

def validate(d):
    problems=[];title=(d.get("title") or "").strip()
    if not 12<=len(title)<=115:problems.append("Title must be 12..115 characters")
    p=Post();p.feed(d.get("content_html") or "")
    if len(re.findall(r"\b[\w-]+\b"," ".join(p.text)))<400:
        problems.append("New post needs at least 400 words")
    if not p.img:problems.append("Real cover image required")
    for img in p.img:
        if not img.get("src","").startswith("https://"):problems.append("Image must have public HTTPS URL")
        if not img.get("alt","").strip():problems.append("Image ALT required")
        if not img.get("width") or not img.get("height"):problems.append("Image dimensions required")
    if not isinstance(d.get("labels"),list) or not d["labels"]:problems.append("Blogger labels required")
    return problems

def api(url,token,method="GET",body=None):
    headers={"Accept":"application/json","Authorization":"Bearer "+token}
    if body is not None:headers["Content-Type"]="application/json"
    req=Request(url,headers=headers,method=method,
                data=json.dumps(body).encode() if body is not None else None)
    with urlopen(req,timeout=30) as res:return json.load(res)

def access_token():
    b=urlencode({"client_id":os.environ["GOOGLE_CLIENT_ID"],
        "client_secret":os.environ["GOOGLE_CLIENT_SECRET"],
        "refresh_token":os.environ["GOOGLE_REFRESH_TOKEN"],
        "grant_type":"refresh_token"}).encode()
    req=Request("https://oauth2.googleapis.com/token",data=b,method="POST",
                headers={"Content-Type":"application/x-www-form-urlencoded"})
    with urlopen(req,timeout=30) as res:return json.load(res)["access_token"]

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--manifest",required=True)
    ap.add_argument("--apply",action="store_true")
    ap.add_argument("--confirm",default="")
    a=ap.parse_args()
    file=Path(a.manifest).resolve();folder=(Path.cwd()/"drafts").resolve()
    if not file.is_relative_to(folder) or file.suffix!=".json":
        ap.error("Manifest must be a JSON file under drafts/")
    d=json.loads(file.read_text(encoding="utf-8"))
    problems=validate(d)
    if problems:
        for x in problems:print("INVALID:",x,file=sys.stderr)
        return 2
    print("Draft validated:",d["title"])
    if not a.apply:
        print("Dry-run only. No API write.");return 0
    if a.confirm!="CREATE_BLOGGER_DRAFT":
        ap.error("Manual confirmation CREATE_BLOGGER_DRAFT required")
    token=access_token()
    base="https://www.googleapis.com/blogger/v3/blogs/"+os.environ["BLOGGER_BLOG_ID"]+"/posts"
    drafts=api(base+"?status=draft&maxResults=100",token)
    for item in drafts.get("items",[]):
        if item.get("title","").strip().casefold()==d["title"].strip().casefold():
            print("Duplicate draft title; not created:",item.get("id"));return 0
    created=api(base+"?isDraft=true",token,"POST",
                {"title":d["title"],"content":d["content_html"],"labels":d["labels"]})
    if not created.get("id") or created.get("status")=="LIVE":
        print("Unexpected API response; check Blogger",file=sys.stderr);return 1
    print("Private draft created:",created["id"])
    return 0

if __name__=="__main__":sys.exit(main())
