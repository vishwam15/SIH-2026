# Dataset Report

Status: **audit completed 2026-09-06**

This report describes files present in `DATAFORMODELTRAINING`. A filename or column label is not treated as proof of official provenance.

## Inventory

| File | Type | Records | Coverage | Time range | Geographic granularity | ML role today |
|---|---:|---:|---|---|---|---|
| `dailyrainfallreport_1_0.csv` | CSV | 74 | Mumbai City, Maharashtra | 2025-06-01 to 2025-08-12 | City/district label only; no coordinates | Rainfall observation candidate; no hazard label |
| `rainfall_area-wt_India_1901-2015.csv` | CSV | 115 | India aggregate | 1901-2015 | National aggregate | Historical rainfall analysis candidate; no hazard label |
| `rainfall_area-wt_sd_1901-2015.csv` | CSV | 4,116 | 36 named meteorological subdivisions | 1901-2015 | Meteorological subdivision; not administrative hierarchy | Historical rainfall analysis candidate; no hazard label |
| `Sub_Division_IMD_2017.csv` | CSV | 4,188 | 36 named meteorological subdivisions | 1901-2017 | Meteorological subdivision; not administrative hierarchy | Historical rainfall analysis candidate; no hazard label |
| `landslide_report.pdf` | PDF | Not applicable | Not verified from repository metadata | Not verified | Not machine-readable inventory established | Reference candidate only; not a label source |

## CSV schemas and quality notes

### Mumbai daily rainfall

Columns: `District`, `Date`, `Daily Rainfall (m.m)`, `Progressive (m.m)`.

The only geography value is `Mumbai City Maharashtra`. This is a short daily series, not a flood-event inventory. It has no coordinates, CRS, water levels, flood occurrence, or administrative IDs. `Progressive (m.m)` is a derived cumulative field and must not be confused with a hazard label.

### India aggregate rainfall

Columns: `REGION`, `YEAR`, monthly rainfall fields, `ANNUAL`, and seasonal aggregates. The only region value is `INDIA`. It cannot support city, district, ward, or location-specific predictions.

### Subdivision rainfall products

Both files contain monthly and seasonal rainfall fields for 36 named subdivisions. They are related rainfall products with overlapping coverage, not independent flood labels. Names such as `Konkan & Goa`, `Kerala`, and `Sub Himalayan West Bengal & Sikkim` are meteorological subdivisions and must not be silently converted into state/city records.

## Authenticity and provenance classification

- CSVs: **SOURCE UNVERIFIED** from repository contents. The names suggest IMD-style products, but no source URL, download date, license, checksum, or provenance file is included.
- `landslide_report.pdf`: **SOURCE UNVERIFIED** and not accepted as a label dataset until its publisher, inventory methodology, geographic scope, dates, and extractable records are verified.
- No file was classified as synthetic solely from its filename.
- Frontend/server fixtures and `ml_service/app.py::synthetic_rows` are separately classified as **DEMO/TEST DATA**, not authentic observations.

## Missing values, duplicates, units, coordinates

The repository audit did not establish a complete cell-level quality profile for every PDF field. The CSV schemas contain rainfall values in millimetres (the daily file spells this as `m.m`), but unit metadata is not supplied. There are no latitude/longitude or CRS columns. Duplicate-event analysis is not applicable because no event identifier or event label exists; duplicate row checks should be part of the reproducible ingestion pipeline.

## Training suitability

No CSV contains flood labels, landslide labels, water depth labels, landslide occurrence labels, or a defensible target variable. These files can currently support rainfall climatology and feature exploration only. They must not be used to report supervised flood/landslide accuracy.

## Initial coverage conclusion

The only city-level operational-looking series is Mumbai. The historical subdivision products broaden rainfall context but do not provide city/district/ward coverage or hazard labels. Additional verified event inventories and aligned covariates are required before selecting representative training states/cities.
