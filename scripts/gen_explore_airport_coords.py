#!/usr/bin/env python3
"""Regenerate backend/data/explore_airport_coords.tsv from OpenFlights + city-code aliases.

Run from repo root when explore_airport_codes.txt changes:
  python3 scripts/gen_explore_airport_coords.py
Requires network to fetch airports.dat once.
"""
from __future__ import annotations

import csv
import io
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CODES_PATH = ROOT / "backend/data/explore_airport_codes.txt"
OUT_PATH = ROOT / "backend/data/explore_airport_coords.tsv"
OPENFLIGHTS = (
    "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"
)

# Metro / synthetic codes in our dictionary → representative IATA in OpenFlights
ALIASES = {
    "LON": "LHR",
    "NYC": "JFK",
    "PAR": "CDG",
    "ROM": "FCO",
    "MIL": "MXP",
    "CHI": "ORD",
    "TYO": "NRT",
    "SEL": "ICN",
    "STO": "ARN",
    "WAS": "IAD",
    "MOW": "SVO",
    "BUE": "EZE",
    "MDV": "MLE",
    "BER": "BER",
}
MANUAL = {
    "BER": (52.3667, 13.5033),
    "MDV": (4.19185, 73.529),  # Velana Intl if MLE missing from OpenFlights
}


def main() -> None:
    codes = set()
    for line in CODES_PATH.read_text().splitlines():
        c = line.strip().upper()
        if len(c) == 3:
            codes.add(c)

    raw = urllib.request.urlopen(OPENFLIGHTS, timeout=120).read().decode("utf-8", "replace")
    reader = csv.reader(io.StringIO(raw))
    found: dict[str, tuple[float, float]] = {}
    for row in reader:
        if len(row) < 8:
            continue
        iata = row[4].strip()
        if iata == "\\N" or len(iata) != 3:
            continue
        try:
            lat, lon = float(row[6]), float(row[7])
        except ValueError:
            continue
        if iata in codes and iata not in found:
            found[iata] = (lat, lon)

    for code, target in ALIASES.items():
        if code not in codes or code in found:
            continue
        if target in found:
            found[code] = found[target]
        elif target in MANUAL:
            found[code] = MANUAL[target]
    for code, ll in MANUAL.items():
        if code in codes and code not in found:
            found[code] = ll

    missing = sorted(codes - set(found.keys()))
    if missing:
        print("Missing coords for:", missing, file=sys.stderr)
        sys.exit(1)

    lines = [f"{code}\t{found[code][0]:.6f}\t{found[code][1]:.6f}\n" for code in sorted(found.keys())]
    OUT_PATH.write_text("".join(lines))
    print(f"Wrote {len(found)} rows to {OUT_PATH}")


if __name__ == "__main__":
    main()
