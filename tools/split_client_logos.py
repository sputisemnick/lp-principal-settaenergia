from pathlib import Path
from PIL import Image, ImageChops, ImageDraw


SOURCE = Path(r"C:\Users\cassi\OneDrive\Desktop\SettaEnergiaWebsite-main\assets\clientes-totais2.png")
OUTPUT = Path(r"C:\Users\cassi\OneDrive\Desktop\lp-empresas-setta\assets\images\clientes")
PREVIEW = Path(r"C:\Users\cassi\OneDrive\Documentos\SETTA ENERGIA\clientes-recortes-preview.png")

NAMES = [
    "verdfrut", "nova-mobi", "pizza-hut", "varanda-do-parque", "real-botequim",
    "economico", "finger", "cattan", "narciso-enxovais", "autonunes",
    "casa-do-para", "vitrage", "farmacias-prime", "boi-verde", "colegio-decisao",
    "pharmapele", "sao-braz", "postos-domingos", "esposende", "veterinarii",
    "x1-fitness", "drogaria-santa-fe", "life-academia", "eco-postos", "clinica-armando-moura",
]

# Os logotipos não ocupam células perfeitamente regulares. Estes intervalos
# passam pelas faixas brancas entre as fileiras e evitam capturar a marca abaixo.
ROW_BANDS = [(0, 166), (166, 329), (329, 521), (521, 689), (689, 910)]
CANVAS = (400, 180)
MAX_LOGO = (344, 128)
MANUAL_TRIMS = {
    # Marcas vizinhas ultrapassam levemente a divisão geométrica da matriz.
    "pizza-hut": (80, 0, 362, 166),
    "esposende": (0, 78, 362, 168),
}


def visible_bbox(image: Image.Image):
    rgb = image.convert("RGB")
    white = Image.new("RGB", rgb.size, "white")
    diff = ImageChops.difference(rgb, white).convert("L")
    mask = diff.point(lambda px: 255 if px > 10 else 0)
    return mask.getbbox()


def normalize_logo(crop: Image.Image) -> Image.Image:
    bbox = visible_bbox(crop)
    if not bbox:
        return Image.new("RGB", CANVAS, "white")
    logo = crop.crop(bbox).convert("RGBA")
    logo.thumbnail(MAX_LOGO, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", CANVAS, "white")
    x = (CANVAS[0] - logo.width) // 2
    y = (CANVAS[1] - logo.height) // 2
    canvas.alpha_composite(logo, (x, y))
    return canvas.convert("RGB")


def main():
    source = Image.open(SOURCE).convert("RGB")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    column_width = source.width // 5
    normalized = []

    for index, name in enumerate(NAMES):
        row, col = divmod(index, 5)
        x0 = col * column_width
        x1 = source.width if col == 4 else (col + 1) * column_width
        y0, y1 = ROW_BANDS[row]
        crop = source.crop((x0, y0, x1, y1))
        if name in MANUAL_TRIMS:
            crop = crop.crop(MANUAL_TRIMS[name])
        logo = normalize_logo(crop)
        logo.save(OUTPUT / f"{name}.png", optimize=True)
        normalized.append((name, logo))

    preview = Image.new("RGB", (CANVAS[0] * 5, CANVAS[1] * 5), "#eeeeee")
    draw = ImageDraw.Draw(preview)
    for index, (_, logo) in enumerate(normalized):
        row, col = divmod(index, 5)
        preview.paste(logo, (col * CANVAS[0], row * CANVAS[1]))
        draw.rectangle((col * CANVAS[0], row * CANVAS[1], (col + 1) * CANVAS[0] - 1, (row + 1) * CANVAS[1] - 1), outline="#dddddd", width=2)
    preview.save(PREVIEW, optimize=True)


if __name__ == "__main__":
    main()
