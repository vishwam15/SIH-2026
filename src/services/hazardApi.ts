export interface PredictionInput {
  rainfall_mm: number;
  soil_moisture_pct: number;
  tide_level_m: number;
}

export interface PredictionOutput {
  xgboost_risk_level: string;
  risk_code: number;
  predicted_water_depth_cm: number;
  input_telemetry: PredictionInput;
}

export const fetchHazardPrediction = async (
  input: PredictionInput
): Promise<PredictionOutput> => {
  const response = await fetch("http://127.0.0.1:8000/api/v1/predict-hazard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return await response.json();
};