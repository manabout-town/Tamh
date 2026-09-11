#!/usr/bin/env python3
"""
메뉴 사진을 카드 규격에 맞춰 public/menu/ 에 넣습니다.

사용법:
    python3 scripts/fit_menu_image.py <이미지파일> <저장이름> [메뉴이름]

예:
    python3 scripts/fit_menu_image.py ~/Downloads/gemini.png gin-tonic 진토닉

하는 일:
    1. 바깥 흰 여백을 잘라냅니다 (Gemini 결과물에 종종 붙습니다)
    2. 가운데 정사각형으로 맞춰 1200x1200 JPEG 로 저장합니다
    3. public/menu/<저장이름>.jpg 로 씁니다
    4. 메뉴에 연결할 SQL 을 출력합니다

Pillow 가 필요합니다:  pip install Pillow
"""

import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow 가 필요합니다. 먼저 실행하세요:  pip install Pillow")

SIZE = 1200
QUALITY = 86
# 이 값보다 밝으면 잘라낼 여백으로 봅니다 (0~255)
WHITE_THRESHOLD = 170


def content_box(im: Image.Image) -> tuple[int, int, int, int]:
    """바깥의 밝은 여백을 뺀 실제 내용 영역을 찾습니다."""
    step = max(1, min(im.size) // 600)
    small = im.resize((im.width // 4 or 1, im.height // 4 or 1))
    px = small.load()
    sw, sh = small.size

    def dark(x: int, y: int) -> bool:
        r, g, b = px[x, y]
        return (r + g + b) / 3 < WHITE_THRESHOLD

    def first_dark_column(cols) -> int:
        for x in cols:
            if sum(1 for y in range(0, sh, 4) if dark(x, y)) > (sh / 4) * 0.25:
                return x
        return 0

    def first_dark_row(rows) -> int:
        for y in rows:
            if sum(1 for x in range(0, sw, 4) if dark(x, y)) > (sw / 4) * 0.25:
                return y
        return 0

    left = first_dark_column(range(sw))
    right = first_dark_column(range(sw - 1, -1, -1))
    top = first_dark_row(range(sh))
    bottom = first_dark_row(range(sh - 1, -1, -1))

    box = (left * 4, top * 4, (right + 1) * 4, (bottom + 1) * 4)
    # 여백 판정이 빗나가 지나치게 잘렸으면 원본을 그대로 씁니다
    if box[2] - box[0] < im.width * 0.4 or box[3] - box[1] < im.height * 0.4:
        return (0, 0, im.width, im.height)
    return box


def main() -> None:
    if len(sys.argv) < 3:
        sys.exit(__doc__)

    src = Path(sys.argv[1]).expanduser()
    slug = sys.argv[2].removesuffix(".jpg")
    menu_name = sys.argv[3] if len(sys.argv) > 3 else None

    if not src.exists():
        sys.exit(f"파일을 찾을 수 없습니다: {src}")

    root = Path(__file__).resolve().parent.parent
    out_dir = root / "public" / "menu"
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / f"{slug}.jpg"

    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    before = im.size

    im = im.crop(content_box(im))

    side = min(im.size)
    w, h = im.size
    im = im.crop(((w - side) // 2, (h - side) // 2, (w + side) // 2, (h + side) // 2))
    im = im.resize((SIZE, SIZE), Image.LANCZOS)
    im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)

    rel = f"/menu/{slug}.jpg"
    print(f"{before[0]}x{before[1]}  →  {SIZE}x{SIZE}   {out.stat().st_size // 1024}KB")
    print(f"저장: {out.relative_to(root)}")
    print()

    if menu_name:
        escaped = menu_name.replace("'", "''")
        print("Supabase SQL Editor 에 붙여넣으세요:")
        print(f"  update public.menus set image_url = '{rel}' where name = '{escaped}';")
    else:
        print(f"메뉴판 관리자 모드에서 카드 → '주소 입력' 에 넣으세요:  {rel}")


if __name__ == "__main__":
    main()
