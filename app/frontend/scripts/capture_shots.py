"""Capture live app screenshots at 1440x900 and save optimized WebP to public/shots/."""
import asyncio
import io
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parent.parent / "public" / "shots"
OUT.mkdir(parents=True, exist_ok=True)

SHOTS = [
    ("paperrepro", "Paper Repro Agent", "https://paperrepro-aiid.atoms.world", None),
    ("paperrepro-benchmark", "Paper Repro Agent - Benchmark", "https://paperrepro-aiid.atoms.world", "Benchmark"),
    ("reprolite", "Repro Lite", "https://reprolite-aiid.pub.atoms.world", None),
    ("readingcompanion", "Reading Companion", "https://readingcompanion-aiid.pub.atoms.world", None),
    ("indexboard", "IndexBoard", "https://indexboard-aiid.pub.atoms.world/b/5dhum9j5h0", None),
    ("reprodesk", "Repro Desk", "https://reprodesk-aiid.pub.atoms.world", None),
    ("paperexplainer", "Paper Explainer", "https://paperexplainer-aiid.pub.atoms.world", None),
]

# Optional CLI filter: `python3 capture_shots.py paperexplainer reprolite`
ONLY = set(sys.argv[1:])


def save_webp(png: bytes, name: str) -> None:
    img = Image.open(io.BytesIO(png)).convert("RGB")
    img.save(OUT / f"{name}.webp", "WEBP", quality=78, method=6)


def placeholder(name: str, title: str) -> None:
    img = Image.new("RGB", (1440, 900), "#EEF2F7")
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 1440, 64], fill="#FFFFFF")
    d.line([0, 64, 1440, 64], fill="#DCE2EA", width=2)
    try:
        font = ImageFont.truetype("DejaVuSerif.ttf", 64)
    except OSError:
        font = ImageFont.load_default()
    w = d.textlength(title, font=font)
    d.text(((1440 - w) / 2, 410), title, fill="#1F4E8C", font=font)
    img.save(OUT / f"{name}.webp", "WEBP", quality=80, method=6)


async def capture(browser, url: str, click: str | None) -> bytes:
    page = await browser.new_page(viewport={"width": 1440, "height": 900})
    try:
        await page.goto(url, wait_until="networkidle", timeout=60000)
        await page.wait_for_timeout(2500)
        if click:
            target = page.get_by_text(click, exact=True).first
            await target.click(timeout=15000)
            await page.wait_for_timeout(3000)
        return await page.screenshot(full_page=False)
    finally:
        await page.close()


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for name, title, url, click in SHOTS:
            if ONLY and name not in ONLY:
                continue
            for attempt in (1, 2):
                try:
                    save_webp(await capture(browser, url, click), name)
                    print(f"OK {name}")
                    break
                except Exception as exc:  # noqa: BLE001
                    print(f"FAIL {name} attempt {attempt}: {exc}")
                    if attempt == 2:
                        placeholder(name, title)
                        print(f"PLACEHOLDER {name}")
        await browser.close()


asyncio.run(main())
