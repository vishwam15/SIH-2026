# Data Provenance

Status: **initial audit; source verification pending**

## Dataset register

| Dataset | Source | URL | Download date | Coverage | Preprocessing | Intended usage |
|---|---|---|---|---|---|---|
| `dailyrainfallreport_1_0.csv` | SOURCE UNVERIFIED | Not present | Not present | Mumbai City, 2025-06-01 to 2025-08-12 | None recorded | Rainfall observation analysis only |
| `rainfall_area-wt_India_1901-2015.csv` | SOURCE UNVERIFIED | Not present | Not present | India aggregate, 1901-2015 | None recorded | Historical rainfall climatology only |
| `rainfall_area-wt_sd_1901-2015.csv` | SOURCE UNVERIFIED | Not present | Not present | 36 meteorological subdivisions, 1901-2015 | None recorded | Subdivision rainfall climatology only |
| `Sub_Division_IMD_2017.csv` | SOURCE UNVERIFIED | Not present | Not present | 36 meteorological subdivisions, 1901-2017 | None recorded | Subdivision rainfall climatology only |
| `landslide_report.pdf` | SOURCE UNVERIFIED | Not present | Not present | Not established | Not extracted/validated | Reference material only; not a label source |

## Policy

A dataset is not treated as official because its filename contains `IMD`, `India`, `flood`, `landslide`, or a government organization name. Before production training, record the publisher, stable URL, access/download date, license, checksum, geographic definition, time range, units, and transformations.

## Demo data separation

The frontend mock fixtures, backend seed/mock records, and `ml_service.py` synthetic rows are **DEMO/TEST DATA**. They must not be combined with observational data or used to report real-world performance.

## Transformation log

No cross-dataset merge has been approved. The rainfall datasets have different geographic units and time granularities, and no flood or landslide event labels are present. Joining them to hazard events is deferred until a defensible spatial and temporal relationship is supplied.
