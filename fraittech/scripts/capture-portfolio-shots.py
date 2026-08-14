#!/usr/bin/env python3
"""Capture landing (hero + full-page) screenshots for portfolio websites."""

from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "img" / "Projects" / "website"
FULL = OUT / "full"
FULL.mkdir(parents=True, exist_ok=True)

SITES = [
    ("tasksfy", "https://tasksfy.com"),
    ("food", "https://foodsecuritymillers.com"),
    ("Lasatarah", "https://lasatarah.co.ke"),
    ("all", "https://allthingsgrand.co.ke/"),
    ("larpei", "https://www.larpeiandcompanyadvocates.co.ke/"),
    ("kc", "https://www.kingdomcitychurchnanyuki.org/"),
    ("geeradio", "https://geeradio.co.ke"),
    ("bamba-radio", "https://bambaradio.com/"),
    ("fmk-interior", "https://fmkdecor.co.ke"),
    ("nanyuki-now", "https://nanyukinow.co.ke"),
    ("munene-pen", "https://munenepen.co.ke"),
]

DISMISS_JS = """
() => {
  const texts = /^(accept|agree|ok|got it|allow|close|i agree)$/i;
  document.querySelectorAll('button, a, [role="button"]').forEach((el) => {
    const t = (el.innerText || el.textContent || "").trim();
    if (texts.test(t) && t.length < 24) {
      try { el.click(); } catch (e) {}
    }
  });
  [".cookie", "#cookie", "[class*='cookie']", "[id*='cookie']", ".cc-window",
   "[class*='consent']", "#cookies-eu-banner"].forEach((sel) => {
    document.querySelectorAll(sel).forEach((n) => { n.style.display = "none"; });
  });
}
"""


def save_webp(src_png: Path, dest_webp: Path, max_width: int, quality: int = 78) -> None:
    img = Image.open(src_png).convert("RGB")
    if img.width > max_width:
        h = int(img.height * (max_width / img.width))
        img = img.resize((max_width, h), Image.Resampling.LANCZOS)
    dest_webp.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest_webp, "WEBP", quality=quality, method=6)


def capture():
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(
            channel="chrome",
            headless=True,
            args=["--hide-scrollbars", "--disable-gpu"],
        )
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=1,
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
            ),
        )
        page = context.new_page()
        page.set_default_timeout(60000)

        for slug, url in SITES:
            print(f"→ {slug}  {url}")
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=60000)
                try:
                    page.wait_for_load_state("networkidle", timeout=12000)
                except Exception:
                    pass
                page.wait_for_timeout(2500)
                try:
                    page.evaluate(DISMISS_JS)
                    page.wait_for_timeout(400)
                except Exception:
                    pass

                hero_png = OUT / f"_{slug}-hero.png"
                full_png = OUT / f"_{slug}-full.png"
                page.screenshot(path=str(hero_png), full_page=False)
                page.screenshot(path=str(full_png), full_page=True)

                hero_webp = OUT / f"{slug}.webp"
                full_webp = FULL / f"{slug}.webp"
                save_webp(hero_png, hero_webp, 1440, 80)
                save_webp(full_png, full_webp, 1200, 72)
                hero_png.unlink(missing_ok=True)
                full_png.unlink(missing_ok=True)
                print(f"  saved {hero_webp.name} + full/{full_webp.name}")
                results.append((slug, "ok"))
            except Exception as e:
                print(f"  FAIL: {e}")
                results.append((slug, str(e)))

        browser.close()
    print("\nDone:")
    for slug, status in results:
        print(f"  {slug}: {status}")


if __name__ == "__main__":
    capture()
