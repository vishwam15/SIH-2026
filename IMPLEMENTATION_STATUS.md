# Implementation Status

Audit date: 2026-09-06

This status is based on the current source code, not planned architecture.

## 1. COMPLETED

- Dataset inventory and provenance documentation exists for the files under `DATAFORMODELTRAINING`.
- Authentic, synthetic, demo, and source-unverified data are distinguished in project documentation.
- MongoDB persistence is enabled through `server/.env` with `USE_MEMORY_DB=false`.
- Backend schemas contain India-ready hierarchy fields on users, sensors, alerts, predictions, flood events, field reports, rainfall observations, and drainage records.
- `GeographicUnit` supports country, state, district, municipality, city, ward, location, and sensor-node records without seeding fabricated geography.
- Canonical authority roles and legacy-role mapping exist in backend authorization middleware.
- Detailed telemetry, sensor, field-report, geography, audit, export, and ML-training routes have backend authentication/scoping controls.
- Citizen field-report reads are restricted to the citizen's own reports.
- ML upload training now rejects records with missing labels rather than generating labels from feature rules.
- Authenticated labelled training runs persist source metadata, uploaded records, metrics, model version, feature version, provenance, and creator in MongoDB `trainingruns`.
- Flood and landslide prediction endpoints remain separate.
- Existing Leaflet map now renders API-provided hazard zones as circles. Flood and landslide zones are red; popup content shows hazard and risk.
- Existing frontend layout, landing page, assets, styling, and map structure were preserved.
- API, dataset, model, and authority documentation files exist.

## 2. PARTIALLY COMPLETED

- Geographic RBAC data structures and query middleware exist, but verified administrative records and an authority-assignment administration workflow are not loaded.
- Legacy frontend login/demo roles remain separate from the backend canonical role system.
- Telemetry overview is protected, but the frontend still falls back to Mumbai demo fixtures when it has no authenticated backend session.
- Alerts remain publicly readable as public warnings; detailed authority-specific alert filtering needs a dedicated public/private response contract.
- Flood nowcast accepts geographic IDs and exposes demo coverage metadata, but its actual drainage/terrain inputs are Mumbai demo fixtures.
- MongoDB persistence is verified for seeded alerts and telemetry nodes; other collections remain empty until their workflows receive data.
- Map circles are connected to the existing `MapZone[]` API shape, but a verified India-wide geography/layer API is not populated.
- IoT-compatible telemetry fields and routes exist, but no physical ESP32 or sensor deployment is connected.

## 3. NOT IMPLEMENTED

- Authentic supervised flood training from the bundled data (blocked because it has no verified hazard labels).
- Authentic supervised landslide training from the bundled data.
- Representative multi-state/city training. The bundled files contain rainfall history but no verified flood or landslide labels.
- Complete reproducible preprocessing, temporal/spatial/event train-validation-test pipeline with persisted artifacts.
- Full leakage audit and false-negative evaluation on labelled hazard events.
- Model registry with persisted model artifacts and governed retraining versions.
- Complete national/state/district/municipal/city/ward dashboards and drill-down workflow.
- Verified administrative boundary and location datasets.
- India-wide GIS layers for rainfall, flood events, landslides, sensors, and affected zones.
- Full server-side geographic enforcement on every historical/event controller.
- Production alert thresholds backed by verified data.
- Real-time sensor ingestion and live operational data claims.

## 4. BROKEN OR MISLEADING

- Existing frontend demo cards still contain hard-coded Mumbai/demo counts and operational-looking copy in some pages.
- The Python service still initializes demo synthetic classifiers at startup. Their metrics are explicitly demo-only and are not valid real-world evaluation.
- The urban flood model is a demo calibration surface, not an empirically trained flood model.
- The application cannot currently claim all-India training, official government affiliation, deployed sensors, or real-time nationwide operation.

## 5. NEEDS VERIFICATION

- Provenance, publisher, URL, license, download date, units, and checksum for every bundled dataset.
- Extractability and publisher of `landslide_report.pdf`; it is not accepted as a machine-readable landslide inventory.
- Exact duplicate/missing-value profile and coordinate/CRS metadata for all future ingestion files.
- Whether any external MongoDB database already contains production data beyond the seeded local records.
- API behavior for authenticated users with populated geographic assignments.

## Current truthful claim

DRISHTI-AI is a Mumbai-focused demo with an India-scalable backend foundation and separate demo flood/landslide prediction surfaces. It is not currently trained on representative authentic hazard labels from multiple Indian states or cities.
