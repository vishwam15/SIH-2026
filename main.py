from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import joblib
import tensorflow as tf
import requests

app = FastAPI(title="SIH Flood & Hazard Prediction API")

# Enable CORS for React dashboard integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load saved ML models on engine startup
print("Loading ML models into memory...")
xgboost_model = joblib.load("models/xgboost_risk.pkl")
lstm_model = tf.keras.models.load_model("models/lstm_flood.h5", compile=False)
lstm_scaler = joblib.load("models/lstm_scaler.pkl")
print("ML Models successfully loaded!")

@app.get("/")
def health_check():
    return {"status": "AI Risk Engine Active", "version": "1.0.0"}

@app.get("/api/v1/live-weather")
def get_live_weather():
    """Fetch live rainfall telemetry from Open-Meteo for Mumbai"""
    url = "https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&hourly=precipitation&timezone=Asia%2FKolkata"
    res = requests.get(url).json()
    live_rain = res["hourly"]["precipitation"][0] # Current hour's rain in mm
    return {"city": "Mumbai", "current_rainfall_mm": live_rain}

@app.post("/api/v1/predict-hazard")
def predict_hazard(data: dict):
    """
    Predicts risk severity and future water depth using XGBoost and LSTM
    """
    rain = data.get("rainfall_mm", 25.0)
    soil = data.get("soil_moisture_pct", 75.0)
    tide = data.get("tide_level_m", 2.5)
    
    # 1. XGBoost Risk Classification
    xgb_features = np.array([[rain, soil, tide]])
    risk_code = int(xgboost_model.predict(xgb_features)[0])
    risk_labels = {0: "LOW", 1: "MEDIUM", 2: "CRITICAL"}
    
    # 2. LSTM 24-Hour Time-Series Depth Prediction
    rain_sequence = data.get("recent_24h_rain", [rain] * 24)
    scaled_seq = lstm_scaler.transform(np.array(rain_sequence).reshape(-1, 1))
    lstm_input = scaled_seq.reshape(1, 24, 1)
    
    predicted_depth_scaled = lstm_model.predict(lstm_input, verbose=0)
    predicted_depth_cm = float(lstm_scaler.inverse_transform(predicted_depth_scaled)[0][0])
    
    return {
        "xgboost_risk_level": risk_labels.get(risk_code, "UNKNOWN"),
        "risk_code": risk_code,
        "predicted_water_depth_cm": round(max(0.0, predicted_depth_cm), 2),
        "input_telemetry": {
            "rainfall_mm": rain,
            "soil_moisture_pct": soil,
            "tide_level_m": tide
        }
    }