"""Capture live app screenshots at 1440x900 in light theme, saved as optimized WebP in public/shots/."""
import asyncio
import io
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parent.parent / "public" / "shots"
OUT.mkdir(parents=True, exist_ok=True)

SHOTS = [
    ("paperrepro", "Paper Repro Agent", "https://paperrepro-aiid.atoms.world/repro/index.html", None),
    ("paperrepro-benchmark", "Paper Repro Agent - Benchmark", "https://paperrepro-aiid.atoms.world/repro/bench.html", None),
    ("reprolite", "Repro Lite", "https://reprolite-aiid.pub.atoms.world", None),
    ("readingcompanion", "Reading Companion", "https://readingcompanion-aiid.pub.atoms.world", None),
    ("indexboard", "IndexBoard", "https://indexboard-aiid.pub.atoms.world/b/5dhum9j5h0", None),
    ("reprodesk", "Repro Desk", "https://reprodesk-aiid.pub.atoms.world", None),
    ("paperexplainer", "Paper Explainer", "https://paperexplainer-aiid.pub.atoms.world", None),
]

# Optional CLI filter: `python3 capture_shots.py paperexplainer reprolite`
ONLY = set(sys.argv[1:])

# Light theme for every app; the Repro Suite design stores it under this key.
LIGHT_THEME_SCRIPT = """
try {
  localStorage.setItem('repro.theme2', 'light');
  localStorage.setItem('theme', 'light');
  localStorage.setItem('rs-theme', 'light');
} catch (e) {}
"""


def save_webp(png: bytes, name: str) -> None:
    img = Image.open(io.BytesIO(png)).convert("RGB")
    img.save(OUT / f"{name}.webp", "WEBP", quality=82, method=6)


def placeholder(name: str, title: str) -> None:
    img = Image.new("RGB", (1440, 900), "#F3F3F6")
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 1440, 64], fill="#FFFFFF")
    d.line([0, 64, 1440, 64], fill="#E4E4EA", width=2)
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 58)
    except OSError:
        font = ImageFont.load_default()
    w = d.textlength(title, font=font)
    d.text(((1440 - w) / 2, 415), title, fill="#2B59FF", font=font)
    img.save(OUT / f"{name}.webp", "WEBP", quality=82, method=6)


async def capture(browser, url: str, click: str | None) -> bytes:
    context = await browser.new_context(
        viewport={"width": 1440, "height": 900},
        color_scheme="light",
        device_scale_factor=1,
    )
    await context.add_init_script(LIGHT_THEME_SCRIPT)
    page = await context.new_page()
    try:
        await page.goto(url, wait_until="networkidle", timeout=60000)
        if click:
            await page.get_by_text(click, exact=True).first.click(timeout=15000)
        await page.wait_for_timeout(6000)
        return await page.screenshot(full_page=False)
    finally:
        await context.close()


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
