# Rebuilds resume.pdf from skills.json, projects.json, clubs.json and certs.json (run from the repo root).
import json
from xml.sax.saxutils import escape as E
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, HRFlowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.units import cm
J = lambda f: json.load(open(f))
skills, projects, clubs, certs = J('skills.json'), J('projects.json'), J('clubs.json'), J('certs.json')
CONTACT = "Bengaluru, India | adityaurank410@gmail.com | linkedin.com/in/asuf10ppy | github.com/asuf10ppy | asuf10ppy.github.io"
SUMMARY = "Freshman CSE student at IIIT Bangalore interested in embedded systems, OS internals and low-level security. I learn by building: ESP32 and ESP8266 IoT projects, Arduino robotics and electronics. Open to internships, research and collaborations in embedded and systems security."
EDU = [("IIIT Bangalore", "B.Tech, Computer Science and Engineering, 2026 to 2030"), ("Narayana PU College", "2nd PUC (PCMC), Karnataka, 97.5%, 2024 to 2026"), ("BEL School CBSE", "Class X, 93.4%, 2024")]
LANG = "English, Hindi (spoken and written), Kannada (spoken)"
G, D, M = HexColor('#0a7a3d'), HexColor('#1a1a1a'), HexColor('#555555')

def build(fs):
    b = ParagraphStyle('b', fontName='Helvetica', fontSize=fs, leading=fs * 1.33, textColor=D)
    bl = ParagraphStyle('bl', parent=b, leftIndent=11, bulletIndent=2)
    h = ParagraphStyle('h', fontName='Helvetica-Bold', fontSize=fs + 1.7, leading=fs + 4.5, textColor=G, spaceBefore=8, spaceAfter=2)
    S = [Paragraph('Aditya S Uranakar', ParagraphStyle('n', fontName='Helvetica-Bold', fontSize=22, leading=26, textColor=D)),
         Paragraph(E(CONTACT), ParagraphStyle('c', fontName='Helvetica', fontSize=fs - .3, leading=12, textColor=M))]
    def H(x):
        S.append(Paragraph(x, h)); S.append(HRFlowable(width='100%', thickness=.6, color=HexColor('#cccccc'), spaceAfter=3))
    H('Summary'); S.append(Paragraph(E(SUMMARY), b))
    H('Education')
    for a, x in EDU: S.append(Paragraph('<b>%s</b>, %s' % (E(a), E(x)), b))
    H('Projects')
    for p in projects:
        S.append(Paragraph('<b>%s, %s</b>' % (E(p['title']), E(p['date'])), b)); S.append(Paragraph(E(p['desc']), bl, bulletText='-'))
    H('Involvement')
    for c in clubs.values():
        S.append(Paragraph('<b>%s, %s</b> (%s): %s.' % (E(c['role']), E(c['name']), E(c['dates']), E('; '.join(c['did']))), b))
    H('Awards and certificates')
    for c in certs: S.append(Paragraph(E('%s, %s, %s.' % (c['t'], c['o'], c['n'])), bl, bulletText='-'))
    H('Skills')
    for g, v in skills.items(): S.append(Paragraph('<b>%s:</b> %s' % (E(g), E(', '.join(v))), b))
    S.append(Paragraph('<b>Languages:</b> ' + E(LANG), b))
    d = SimpleDocTemplate('resume.pdf', pagesize=A4, leftMargin=1.6*cm, rightMargin=1.6*cm, topMargin=1.2*cm, bottomMargin=1.1*cm,
                          title='Aditya S Uranakar - Resume', author='Aditya S Uranakar', invariant=1)
    d.build(S); return d.page

for fs in (9.3, 9.0, 8.7, 8.4, 8.1, 7.8):
    if build(fs) == 1: break
print('built resume.pdf at font size', fs)
