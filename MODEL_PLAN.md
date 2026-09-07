# Model Plan

## Current status

**Implemented:** a FastAPI prediction surface with separate flood/landslide endpoints, optional scikit-learn/XGBoost classifiers, authenticated labelled upload training, and MongoDB training-run persistence. Startup models remain deterministic synthetic demo models.

**Not implemented:** an authentic flood model, an authentic landslide model, reproducible model artifacts, spatial/temporal validation, or verified event labels.

## Intended architecture

Flood and landslide remain separate hazard models. They share geographic identifiers, ingestion, prediction storage, alerting, and GIS infrastructure, but their features and labels are not merged without a defensible spatial and temporal relationship.

```text
verified sources -> validation -> cleaning -> geographic/temporal alignment
                 -> feature engineering -> authentic labels
                 -> temporal/spatial/event split -> training -> evaluation
                 -> versioned artifact -> prediction API -> alerts/GIS
```

## Flood pipeline proposal

Use rainfall observations with verified flood occurrence or water-depth labels. Candidate features are limited to fields actually present after ingestion. The current repository supplies rainfall but no flood labels, water levels, elevation, drainage, or coordinates, so supervised flood training is blocked.

## Landslide pipeline proposal

Use a verified landslide inventory and aligned rainfall, terrain, soil, geology, and land-cover covariates. The current repository supplies no machine-readable landslide labels or verified covariates, so supervised landslide training is blocked.

## Validation requirements

Prefer temporal, spatial, or event-based holdouts over random row splits when the data structure requires it. Check duplicate observations, duplicate events, target leakage, future-feature leakage, and spatial contamination. Report false negatives explicitly because missed hazards are operationally important.

## Versioning

Every future prediction should carry `model_name`, `model_version`, `training_dataset_version`, `feature_version`, `prediction_timestamp`, geographic IDs, and source references.
