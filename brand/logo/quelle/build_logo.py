"""Rebuild the matthiasramahi.de header wordmark as outlined vector + PNG.

Matches live CSS: Archivo variable, wght 700, wdth 75, letter-spacing -0.005em,
line-height 0.82, uppercase, two lines, left aligned.
"""
import sys, os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.freetypePen import FreeTypePen
from fontTools.pens.reportLabPen import ReportLabPen
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

FONT, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

LIGHT, DARK = "#f3f5ef", "#020306"
LINES = ["MATTHIAS", "RAMAHI"]

f = TTFont(FONT)
print("axes:", [(a.axisTag, a.minValue, a.maxValue) for a in f["fvar"].axes])
f = instantiateVariableFont(f, {"wght": 700, "wdth": 75})
upm = f["head"].unitsPerEm
gs = f.getGlyphSet()
cmap = f.getBestCmap()
hmtx = f["hmtx"]
kern = None  # GPOS kerning ignored; browser shows default kerning, check visually

ls = -0.005 * upm
lh = 0.82 * upm

# Record all glyphs in font units, y-up, baseline of line 1 at y=0.
import uharfbuzz as hb, io
f.flavor = None
buf_font = io.BytesIO(); f.save(buf_font)
hbfont = hb.Font(hb.Face(buf_font.getvalue()))
order = f.getGlyphOrder()
rec = RecordingPen()
for i, line in enumerate(LINES):
    b = hb.Buffer(); b.add_str(line); b.guess_segment_properties()
    hb.shape(hbfont, b, {"kern": True, "liga": True})
    x = 0.0
    y = -i * lh
    for info, pos in zip(b.glyph_infos, b.glyph_positions):
        g = order[info.codepoint]
        gs[g].draw(TransformPen(rec, (1, 0, 0, 1, x + pos.x_offset, y + pos.y_offset)))
        x += pos.x_advance + ls

bp = BoundsPen(None)
rec.replay(bp)
xmin, ymin, xmax, ymax = bp.bounds
w, h = xmax - xmin, ymax - ymin
print("bounds", bp.bounds)

def build(path, scale, pad_frac, fg, bg):
    pad = pad_frac * h
    W, H = (w + 2 * pad) * scale, (h + 2 * pad) * scale
    # SVG: y-down. map font (x,y) -> ((x-xmin+pad)*s, (ymax-y+pad)*s)
    sp = SVGPathPen(None)
    t = TransformPen(sp, (scale, 0, 0, -scale, (pad - xmin) * scale, (ymax + pad) * scale))
    rec.replay(t)
    d = sp.getCommands()
    bgrect = f'  <rect width="100%" height="100%" fill="{bg}"/>\n' if bg else ""
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {H:.2f}" '
           f'width="{W:.2f}" height="{H:.2f}">\n  <title>Matthias Ramahi</title>\n{bgrect}'
           f'  <path fill="{fg}" d="{d}"/>\n</svg>\n')
    open(path, "w", encoding="utf-8").write(svg)
    return W, H

def pdf(path, pad_frac, fg, bg):
    pad = pad_frac * h
    s = 0.1  # 1000 upm -> ~100pt tall
    W, H = (w + 2 * pad) * s, (h + 2 * pad) * s
    c = canvas.Canvas(path, pagesize=(W, H))
    c.setTitle("Matthias Ramahi – Wortmarke")
    if bg:
        c.setFillColor(HexColor(bg)); c.rect(0, 0, W, H, stroke=0, fill=1)
    from fontTools.pens.basePen import BasePen
    pth = c.beginPath()
    class P(BasePen):
        def _moveTo(self, pt): pth.moveTo(*pt)
        def _lineTo(self, pt): pth.lineTo(*pt)
        def _curveToOne(self, a, b, d): pth.curveTo(*a, *b, *d)
        def _closePath(self): pth.close()
    rec.replay(TransformPen(P(None), (s, 0, 0, s, (pad - xmin) * s, (pad - ymin) * s)))
    c.setFillColor(HexColor(fg))
    c.drawPath(pth, stroke=0, fill=1, fillMode=0)
    c.showPage(); c.save()

def png(path, width_px, pad_frac, fg, bg):
    from PIL import Image
    pad = pad_frac * h
    s = width_px / (w + 2 * pad)
    W, H = round((w + 2 * pad) * s), round((h + 2 * pad) * s)
    ft = FreeTypePen(None)
    rec.replay(TransformPen(ft, (s, 0, 0, s, (pad - xmin) * s, (pad - ymin) * s)))
    mask = ft.image(width=W, height=H, contain=False, evenOdd=False)  # RGBA, alpha = coverage
    alpha = mask.getchannel("A")
    rgb = Image.new("RGBA", (W, H), fg)
    rgb.putalpha(alpha)
    if bg:
        base = Image.new("RGBA", (W, H), bg)
        base.alpha_composite(rgb)
        rgb = base
    rgb.save(path, optimize=True)

variants = {
    "hell": (LIGHT, None),          # helle Schrift, transparent (für dunkle Untergründe)
    "dunkel": (DARK, None),         # dunkle Schrift, transparent (für helle Untergründe)
    "hell-auf-schwarz": (LIGHT, DARK),
}
PAD = 0.18
for name, (fg, bg) in variants.items():
    pf = PAD if bg else 0.0
    build(f"{OUT}/vektor/matthias-ramahi-logo-{name}.svg", 0.2, pf, fg, bg)
    pdf(f"{OUT}/vektor/matthias-ramahi-logo-{name}.pdf", pf, fg, bg)
    for wpx in (1000, 3000):
        png(f"{OUT}/png/matthias-ramahi-logo-{name}-{wpx}px.png", wpx, pf, fg, bg)
print("ok")
