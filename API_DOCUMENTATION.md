# API Documentation

## Current implemented surfaces

- `GET /health` - backend health.
- `GET /api/status` - database mode and aggregate seeded counts.
- `GET /api/telemetry/overview` - dashboard overview; currently may expose seeded/demo data.
- `POST /api/ml/predict-flood` - forwards flood feature input to the Python service.
- `POST /api/ml/predict-landslide` - forwards landslide feature input to the Python service.
- `POST /api/ml/train/:kind` - requires a JWT for `NATIONAL_ADMIN` or `STATE_AUTHORITY`, requires labelled records, forwards training to FastAPI, and stores the uploaded records plus provenance, metrics, and version metadata in MongoDB `trainingruns`.
- `GET /api/geography` - authenticated, scoped list of geographic units already loaded in MongoDB. It does not fabricate missing administrative records.
- Authentication, alert, telemetry, flood, field-report, audit, and citizen routes are mounted under `/api`.

## Target geographic contract

Predictions, events, sensors, alerts, and reports should carry applicable `country_id`, `state_id`, `district_id`, `municipality_id`, `city_id`, `ward_id`, `location_id`, `sensor_node_id`, latitude, and longitude. The backend must derive or validate accessible scope from the authenticated user rather than trusting URL/body geography alone.

## Data-source and model metadata

Future prediction responses and records should include hazard type, risk score/level, timestamp, model name/version, training dataset version, feature version, source references, and geographic scope. Thresholds must be labelled as model-derived, dataset-derived, configured operational, or demonstration thresholds.

## Security note

The current frontend can use fallback mock data when the backend is unavailable, and current server middleware does not enforce geographic scope. These are demo limitations, not production authorization guarantees.

Detailed telemetry overview and management routes now require authentication and geographic scope. Public alerts remain available as public-warning information; private authority alert responses still require a dedicated response contract.
