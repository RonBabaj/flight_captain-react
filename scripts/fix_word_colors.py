#!/usr/bin/env python3
"""Fix Word PDF conversion in-place: colors, text, barcodes preserved."""

from __future__ import annotations

import shutil
from copy import deepcopy

from docx import Document
from docx.enum.text import WD_UNDERLINE
from docx.oxml.ns import qn
from docx.shared import RGBColor

SRC = "/opt/cursor/artifacts/word_converted_input.docx"
OUT = "/opt/cursor/artifacts/medical_certificate.docx"

BLUE = RGBColor(0x00, 0x00, 0x8B)
BLACK = RGBColor(0x00, 0x00, 0x00)


def has_drawing(run) -> bool:
    return bool(run._element.xpath(".//w:drawing"))


def clear_text_runs(paragraph):
    for run in list(paragraph.runs):
        if not has_drawing(run):
            run._element.getparent().remove(run._element)


def add_run(paragraph, text, *, blue=False, bold=False, underline=False):
    r = paragraph.add_run(text)
    r.bold = bold
    r.font.name = "Arial"
    r.font.color.rgb = BLUE if blue else BLACK
    if underline:
        r.font.underline = WD_UNDERLINE.SINGLE
    return r


def labeled(paragraph, label: str, value: str, bold_label=False):
    add_run(paragraph, label, blue=True, bold=bold_label)
    if value:
        add_run(paragraph, value)


def fix_cell_labeled(cell, pairs: list[tuple[str, str]], extra_lines: list[tuple[str, str]] | None = None):
    p = cell.paragraphs[0]
    clear_text_runs(p)
    for i, (label, value) in enumerate(pairs):
        if i:
            add_run(p, "\n")
        labeled(p, label, value)
    if extra_lines:
        for label, value in extra_lines:
            add_run(p, "\n")
            labeled(p, label, value)


def fix_title(paragraph):
    clear_text_runs(paragraph)
    add_run(paragraph, "אישור מחלה", blue=True, bold=True, underline=True)


def fix_ref(paragraph):
    clear_text_runs(paragraph)
    add_run(paragraph, "ET4D-CV5-ZKC-6R82-449XH")


def fix_body_dates(paragraph):
    clear_text_runs(paragraph)
    parts = [
        ("אינו/ה מסוגל/ת לעבוד מיום:", "\t24/08/2026\t"),
        ("עד יום:", "\t27/08/2026\t"),
        ('סה"כ: ', "4\t"),
        ("ימים.", ""),
    ]
    for i, (label, value) in enumerate(parts):
        labeled(paragraph, label, value, bold_label=True)


def fix_fax(paragraph):
    for run in paragraph.runs:
        if has_drawing(run):
            continue
        if "9257689-08" in run.text:
            run.text = run.text.replace("9257689-08", "08-9257689")


def fix_footer(paragraph):
    clear_text_runs(paragraph)
    add_run(paragraph, "\t")
    add_run(paragraph, "תאריך", blue=True, bold=True)
    add_run(paragraph, "\t")
    add_run(paragraph, "חתימה וחותמת הרופא", blue=True, bold=True)


def main():
    shutil.copy2(SRC, OUT)
    doc = Document(OUT)

    # Title — blue + underline (match PDF heading)
    fix_title(doc.paragraphs[4])

    # Reference code — visible black text
    fix_ref(doc.paragraphs[5])

    # Sick leave dates — blue labels, black values
    fix_body_dates(doc.paragraphs[7])

    # Footer labels
    fix_footer(doc.paragraphs[10])

    # Fax number
    fix_fax(doc.paragraphs[2])

    t = doc.tables[0]
    # Row 0 already structured; ensure label colors
    fix_cell_labeled(t.rows[0].cells[0], [("ת.ז.:", " 215359910")])
    fix_cell_labeled(t.rows[0].cells[1], [("שם פרטי:", " רון")])
    fix_cell_labeled(t.rows[0].cells[2], [("שם משפחה:", " גורפינקל")])
    fix_cell_labeled(t.rows[0].cells[3], [("פרטי הנבדק:", "")])

    # Row 1 — fix garbled fields, keep barcode drawing in cell 3
    fix_cell_labeled(t.rows[1].cells[0], [("טל.עבודה/נייד:", " 0522460193")], [("מיקוד ", "7228212")])
    fix_cell_labeled(t.rows[1].cells[1], [("טלפון:", " 08-9244787")])
    fix_cell_labeled(
        t.rows[1].cells[2],
        [("ת.לידה:", " 30/05/2005\t"), ("מין:", " ז")],
        [("כתובת:", " הרב אפריאט 6, רמלה")],
    )
    # Barcode number only — preserve drawing runs
    p = t.rows[1].cells[3].paragraphs[0]
    for run in list(p.runs):
        if not has_drawing(run):
            run._element.getparent().remove(run._element)
    add_run(p, "0215359910")

    doc.save(OUT)
    print("Saved", OUT)


if __name__ == "__main__":
    main()
