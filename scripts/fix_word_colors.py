#!/usr/bin/env python3
"""Fix Word PDF conversion: BiDi, spacing, colors; preserve barcodes."""

from __future__ import annotations

import shutil

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_UNDERLINE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor

SRC = "/opt/cursor/artifacts/word_converted_input.docx"
OUT = "/opt/cursor/artifacts/medical_certificate.docx"

BLUE = RGBColor(0x00, 0x00, 0x8B)
BLACK = RGBColor(0x00, 0x00, 0x00)
LRM = "\u200e"


def has_drawing(run) -> bool:
    return bool(run._element.xpath(".//w:drawing"))


def set_rtl(paragraph):
    pPr = paragraph._p.get_or_add_pPr()
    bidi = OxmlElement("w:bidi")
    bidi.set(qn("w:val"), "1")
    if pPr.find(qn("w:bidi")) is None:
        pPr.append(bidi)


def set_ltr_run(run):
    rPr = run._element.get_or_add_rPr()
    if rPr.find(qn("w:rtl")) is None:
        rtl = OxmlElement("w:rtl")
        rtl.set(qn("w:val"), "0")
        rPr.append(rtl)


def clear_text_runs(paragraph):
    for run in list(paragraph.runs):
        if not has_drawing(run):
            run._element.getparent().remove(run._element)


def add_run(paragraph, text, *, blue=False, bold=False, underline=False, ltr=False):
    r = paragraph.add_run(text)
    r.bold = bold
    r.font.name = "Arial"
    r.font.color.rgb = BLUE if blue else BLACK
    if underline:
        r.font.underline = WD_UNDERLINE.SINGLE
    if ltr:
        set_ltr_run(r)
    return r


def add_ltr_value(paragraph, text):
    add_run(paragraph, LRM + text, ltr=True)


def delete_paragraph(paragraph):
    element = paragraph._element
    element.getparent().remove(element)


def fix_contact_block(doc):
    """Phone, fax, address — separate lines, centered, correct BiDi."""
    p_phone = doc.paragraphs[2]
    clear_text_runs(p_phone)
    set_rtl(p_phone)
    p_phone.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_phone.paragraph_format.space_after = Pt(2)
    add_run(p_phone, "טלפון: ", blue=True, bold=True)
    add_ltr_value(p_phone, "08-9257689")
    add_run(p_phone, "\n")
    add_run(p_phone, "פקס: ", blue=True, bold=True)
    add_ltr_value(p_phone, "08-9257689")

    p_addr = doc.paragraphs[3]
    clear_text_runs(p_addr)
    set_rtl(p_addr)
    p_addr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_addr.paragraph_format.space_after = Pt(10)
    add_run(p_addr, "כתובת: ", blue=True, bold=True)
    add_run(p_addr, "שטרן יאיר 14, רמלה")


def fix_title(paragraph):
    clear_text_runs(paragraph)
    set_rtl(paragraph)
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    paragraph.paragraph_format.space_before = Pt(8)
    paragraph.paragraph_format.space_after = Pt(10)
    add_run(paragraph, "אישור מחלה", blue=False, bold=True, underline=True)


def fix_body_statement(paragraph):
    set_rtl(paragraph)
    paragraph.paragraph_format.space_after = Pt(8)


def fix_body_dates(paragraph):
    clear_text_runs(paragraph)
    set_rtl(paragraph)
    paragraph.paragraph_format.space_after = Pt(16)
    add_run(paragraph, "אינו/ה מסוגל/ת לעבוד מיום: ", blue=True, bold=True)
    add_ltr_value(paragraph, "24/08/2026")
    add_run(paragraph, "   ")
    add_run(paragraph, "עד יום: ", blue=True, bold=True)
    add_ltr_value(paragraph, "27/08/2026")
    add_run(paragraph, "   ")
    add_run(paragraph, 'סה"כ: ', blue=True, bold=True)
    add_run(paragraph, "4 ימים.")


def fix_footer(paragraph):
    clear_text_runs(paragraph)
    set_rtl(paragraph)
    paragraph.paragraph_format.space_before = Pt(24)
    add_run(paragraph, "\t")
    add_run(paragraph, "תאריך", blue=True, bold=True)
    add_run(paragraph, "\t\t\t\t")
    add_run(paragraph, "חתימה וחותמת הרופא", blue=True, bold=True)


def fix_cell_fields(cell, lines: list[tuple[str, str, bool]]):
    """Each line: (label, value, value_is_ltr)."""
    p = cell.paragraphs[0]
    clear_text_runs(p)
    set_rtl(p)
    for i, (label, value, ltr_val) in enumerate(lines):
        if i:
            add_run(p, "\n")
        add_run(p, label, blue=True, bold=True)
        if value:
            if ltr_val:
                add_run(p, " ")
                add_ltr_value(p, value)
            else:
                add_run(p, " " + value)


def fix_table(doc):
    t = doc.tables[0]
    fix_cell_fields(t.rows[0].cells[0], [("ת.ז.:", "215359910", True)])
    fix_cell_fields(t.rows[0].cells[1], [("שם פרטי:", "רון", False)])
    fix_cell_fields(t.rows[0].cells[2], [("שם משפחה:", "גורפינקל", False)])
    fix_cell_fields(t.rows[0].cells[3], [("פרטי הנבדק:", "", False)])

    fix_cell_fields(
        t.rows[1].cells[0],
        [
            ("טל.עבודה/נייד:", "0522460193", True),
            ("מיקוד:", "7228212", True),
        ],
    )
    fix_cell_fields(t.rows[1].cells[1], [("טלפון:", "08-9244787", True)])
    fix_cell_fields(
        t.rows[1].cells[2],
        [
            ("ת.לידה:", "30/05/2005", True),
            ("מין:", "ז", False),
            ("כתובת:", "הרב אפריאט 6, רמלה", False),
        ],
    )
    p = t.rows[1].cells[3].paragraphs[0]
    set_rtl(p)
    for run in list(p.runs):
        if not has_drawing(run):
            run._element.getparent().remove(run._element)
    add_ltr_value(p, "0215359910")


def remove_et4d_line(doc):
    for p in list(doc.paragraphs):
        if "ET4D" in p.text:
            delete_paragraph(p)
            return


def apply_spacing(doc):
    doc.paragraphs[0].paragraph_format.space_after = Pt(4)
    doc.paragraphs[1].paragraph_format.space_after = Pt(4)
    if doc.paragraphs[8].text.strip():
        p = doc.paragraphs[8]
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        set_rtl(p)
        p.paragraph_format.space_before = Pt(20)


def main():
    shutil.copy2(SRC, OUT)
    doc = Document(OUT)

    fix_contact_block(doc)
    fix_table(doc)
    fix_title(doc.paragraphs[4])
    remove_et4d_line(doc)

    # Re-find paragraphs after deletion
    for p in doc.paragraphs:
        if "הנני לאשר" in p.text:
            fix_body_statement(p)
        if "מסוגל" in p.text:
            fix_body_dates(p)
        if "חתימה וחותמת" in p.text:
            fix_footer(p)

    apply_spacing(doc)
    doc.save(OUT)
    print("Saved", OUT)


if __name__ == "__main__":
    main()
