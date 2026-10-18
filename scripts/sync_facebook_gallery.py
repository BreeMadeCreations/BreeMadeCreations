#!/usr/bin/env python3
"""Sync photos uploaded by the authorized Bree Made Creations Facebook Page."""
import io, json, os, pathlib, urllib.parse, urllib.request
from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEST = ROOT / "assets" / "facebook-gallery"
MANIFEST = ROOT / "facebook-gallery.json"
TOKEN = os.environ.get("FB_PAGE_ACCESS_TOKEN", "")
PAGE = os.environ.get("FB_PAGE_ID", "")
LIMIT = 24

def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "BreeMadeCreationsGallerySync/1.0"})
    with urllib.request.urlopen(req, timeout=35) as response:
        return json.load(response)

def main():
    if not TOKEN or not PAGE:
        raise SystemExit("FB_PAGE_ACCESS_TOKEN and FB_PAGE_ID must be configured as GitHub Actions secrets")
    api = "https://graph.facebook.com/v26.0/" + urllib.parse.quote(PAGE, safe="") + "/photos"
    params = urllib.parse.urlencode({"type":"uploaded", "fields":"id,name,images,created_time,link", "limit":50, "access_token": TOKEN})
    photos = get_json(api + "?" + params).get("data", [])
    if not photos:
        raise SystemExit("No Page photos returned: preserving the existing gallery")
    DEST.mkdir(parents=True, exist_ok=True)
    cards = []
    for photo in photos:
        if len(cards) >= LIMIT: break
        photo_id = str(photo.get("id", ""))
        if not photo_id.isdigit() or not photo.get("images"): continue
        try:
            url = photo["images"][0]["source"]
            req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=35) as response:
                content = response.read(15 * 1024 * 1024 + 1)
            if len(content) > 15 * 1024 * 1024: continue
            with Image.open(io.BytesIO(content)) as im:
                im = ImageOps.exif_transpose(im).convert("RGB")
                im.thumbnail((1600, 1600))
                out = DEST / (photo_id + ".jpg")
                im.save(out, "JPEG", quality=86, optimize=True)
            cards.append({"image":"assets/facebook-gallery/" + photo_id + ".jpg",
                          "alt": (photo.get("name") or "Creation by Bree Made Creations")[:150],
                          "label": "Recent Creation",
                          "post": photo.get("link", "")})
        except Exception as error:
            print("Skipping photo", photo_id, type(error).__name__)
    if not cards:
        raise SystemExit("No photos downloaded successfully: preserving the existing gallery")
    manifest = {"photos":cards}
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    keep = {pathlib.Path(x["image"]).name for x in cards}
    for path in DEST.glob("*.jpg"):
        if path.name not in keep: path.unlink()
    print(f"Saved {len(cards)} Facebook photos")

if __name__ == "__main__":
    main()
