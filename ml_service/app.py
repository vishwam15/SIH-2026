from datetime import datetime, timezone
from typing import Literal
import random

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

try:
    import numpy as np
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import accuracy_score, f1_score
    SKLEARN_READY = True
except ImportError:
    SKLEARN_READY = False

try:
    from xgboost import XGBClassifier
    XGBOOST_READY = True
except ImportError:
    XGBOOST_READY = False

app = FastAPI(title="DisasterShield ML Service", version="1.0.0")
FLOOD_FEATURES = ["rainfall_mm_hr", "water_level_m", "drainage_capacity_pct", "imperviousness_pct", "elevation_m"]
LANDSLIDE_FEATURES = ["rainfall_24h_mm", "soil_moisture_pct", "slope_angle_deg", "ground_tilt_deg", "vibration_hz"]
models = {}
model_metrics = {}


def synthetic_rows(kind: Literal["flood", "landslide"], count=1600):
    rng = random.Random(42 if kind == "flood" else 84)
    rows = []
    for _ in range(count):
        if kind == "flood":
            values = [rng.uniform(0, 180), rng.uniform(0, 4.5), rng.uniform(5, 160), rng.uniform(30, 100), rng.uniform(2, 35)]
            risk = values[0] > 75 and (values[1] > 1.8 or values[2] > 85) or values[0] > 120 or values[3] > 92 and values[2] > 75
        else:
            values = [rng.uniform(0, 350), rng.uniform(20, 100), rng.uniform(2, 55), rng.uniform(0, 8), rng.uniform(0, 20)]
            risk = values[0] > 150 and values[1] > 72 and values[2] > 22 or values[3] > 4.2 or values[4] > 13
        rows.append((values, int(risk)))
    return rows


def fit_models(kind, rows, source):
    if not SKLEARN_READY:
        model_metrics[kind] = {"random_forest": {"accuracy": None, "f1": None}, "logistic_regression": {"accuracy": None, "f1": None}, "selected": "fallback-rule", "training_rows": len(rows), "source": source}
        return
    split = int(len(rows) * 0.8)
    X = np.array([row[0] for row in rows])
    y = np.array([row[1] for row in rows])
    train_x, test_x, train_y, test_y = X[:split], X[split:], y[:split], y[split:]
    candidates = {
        "random_forest": RandomForestClassifier(n_estimators=140, max_depth=8, random_state=42, class_weight="balanced"),
        "logistic_regression": LogisticRegression(max_iter=1000, random_state=42),
    }
    if XGBOOST_READY:
        candidates["xgboost"] = XGBClassifier(n_estimators=120, max_depth=4, learning_rate=0.08, eval_metric="logloss", random_state=42)
    scores = {}
    for name, model in candidates.items():
        model.fit(train_x, train_y)
        prediction = model.predict(test_x)
        scores[name] = {"accuracy": round(float(accuracy_score(test_y, prediction)), 4), "f1": round(float(f1_score(test_y, prediction)), 4)}
    selected = max(scores, key=lambda name: (scores[name]["f1"], scores[name]["accuracy"]))
    models[kind] = candidates[selected]
    model_metrics[kind] = {**scores, "selected": selected, "training_rows": len(rows), "source": source}


def train_models(kind):
    fit_models(kind, synthetic_rows(kind), "synthetic")


def train_uploaded(kind, records):
    feature_names = FLOOD_FEATURES if kind == "flood" else LANDSLIDE_FEATURES
    rows = []
    for record in records:
        try:
            values = [float(record[name]) for name in feature_names]
        except (KeyError, TypeError, ValueError) as error:
            raise ValueError(f"Missing or invalid feature column: {error}") from error
        raw_label = record.get("label", record.get("risk", record.get("flood_risk", record.get("landslide_risk"))))
        if isinstance(raw_label, str):
            label = int(raw_label.upper() in ["1", "TRUE", "YES", "HIGH", "CRITICAL"])
        elif raw_label is not None:
            label = int(float(raw_label) >= 0.5)
        else:
            raise ValueError("Every training record must contain an authentic hazard label; labels are never generated from feature rules")
        rows.append((values, label))
    if len(rows) < 20 or len({row[1] for row in rows}) < 2:
        raise ValueError("Upload at least 20 rows containing both low-risk and high-risk examples")
    fit_models(kind, rows, "uploaded dataset")
    return model_metrics[kind]


train_models("flood")
train_models("landslide")


class FloodInput(BaseModel):
    rainfall_mm_hr: float = Field(ge=0)
    water_level_m: float = Field(ge=0)
    drainage_capacity_pct: float = Field(ge=0, le=250)
    imperviousness_pct: float = Field(ge=0, le=100)
    elevation_m: float = Field(ge=-100, le=10000)


class LandslideInput(BaseModel):
    rainfall_24h_mm: float = Field(ge=0)
    soil_moisture_pct: float = Field(ge=0, le=100)
    slope_angle_deg: float = Field(ge=0, le=90)
    ground_tilt_deg: float = Field(ge=-90, le=90)
    vibration_hz: float = Field(ge=0)


class TrainingInput(BaseModel):
    records: list[dict] = Field(min_length=20, max_length=10000)


def fallback_score(values, kind):
    if kind == "flood":
        rainfall, water, drainage, impervious, elevation = values
        score = rainfall / 180 * 35 + water / 4.5 * 30 + drainage / 160 * 25 + impervious / 100 * 12 - elevation / 35 * 8
    else:
        rain, soil, slope, tilt, vibration = values
        score = rain / 350 * 30 + soil / 100 * 25 + slope / 55 * 25 + abs(tilt) / 8 * 12 + vibration / 20 * 8
    return max(0, min(100, round(score, 1)))


def response_for(values, kind, features):
    score = fallback_score(values, kind)
    selected = model_metrics.get(kind, {}).get("selected", "fallback-rule")
    if SKLEARN_READY and kind in models:
        probability = float(models[kind].predict_proba([values])[0][1]) * 100
        score = round(probability, 1)
    level = "CRITICAL" if score >= 80 else "HIGH" if score >= 60 else "MODERATE" if score >= 35 else "LOW"
    return {
        "model": selected,
        "risk_score": score,
        "risk_level": level,
        "features": dict(zip(features, values)),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "training_status": model_metrics.get(kind, {}).get("training_status", "demo_only"),
        "provenance": model_metrics.get(kind, {}).get("source", "DEMO/TEST DATA"),
    }


@app.get("/health")
def health():
    return {"status": "ok", "sklearn_ready": SKLEARN_READY, "xgboost_ready": XGBOOST_READY}


@app.get("/model-info")
def model_info():
    return {
        "models": model_metrics,
        "feature_sets": {"flood": FLOOD_FEATURES, "landslide": LANDSLIDE_FEATURES},
        "dataset": "DEMO/TEST DATA only: deterministic synthetic rows; no authentic hazard labels are bundled",
        "training_status": "demo_only",
        "provenance": "SOURCE UNVERIFIED until an audited, labelled dataset is supplied",
    }


@app.post("/train/{kind}")
def train_from_upload(kind: Literal["flood", "landslide"], payload: TrainingInput):
    try:
        metrics = train_uploaded(kind, payload.records)
        return {"status": "trained", "hazard": kind, "metrics": metrics}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@app.post("/predict-flood")
def predict_flood(payload: FloodInput):
    values = [payload.rainfall_mm_hr, payload.water_level_m, payload.drainage_capacity_pct, payload.imperviousness_pct, payload.elevation_m]
    return response_for(values, "flood", FLOOD_FEATURES)


@app.post("/predict-landslide")
def predict_landslide(payload: LandslideInput):
    values = [payload.rainfall_24h_mm, payload.soil_moisture_pct, payload.slope_angle_deg, payload.ground_tilt_deg, payload.vibration_hz]
    return response_for(values, "landslide", LANDSLIDE_FEATURES)
