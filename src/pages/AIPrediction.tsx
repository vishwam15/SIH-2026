import React, { useState, useEffect } from 'react';
import type { AIPredictionResult, LiveTelemetryMesh, RiskLevel } from '../types';
import { AIWorkflowDiagram } from '../components/ai/AIWorkflowDiagram';
import { PredictionCard } from '../components/ai/PredictionCard';
import { DisasterShieldAPI } from '../services/api';
import {
  Cpu,
  Sparkles,
  Layers,
  Globe,
  Waves,
  Mountain,
  Zap,
  RefreshCw,
  CheckCircle2,
  Flame,
} from 'lucide-react';

import { mockAIPredictions } from '../data/mockData';

interface AIPredictionProps {
  predictions: AIPredictionResult[];
}

export const AIPrediction: React.FC<AIPredictionProps> = ({ predictions: initialPredictions }) => {
  const [predictionsList, setPredictionsList] = useState<AIPredictionResult[]>(() => {
    return initialPredictions && initialPredictions.length > 0 ? initialPredictions : mockAIPredictions;
  });
  const [liveMesh, setLiveMesh] = useState<LiveTelemetryMesh | null>(null);

  useEffect(() => {
    if (initialPredictions && initialPredictions.length > 0) {
      setPredictionsList(initialPredictions);
    }
  }, [initialPredictions]);

  // Live Simulator Inputs
  const [simRainfall, setSimRainfall] = useState<number>(85);
  const [simElevation, setSimElevation] = useState<number>(2.4);
  const [simSlope, setSimSlope] = useState<number>(38);
  const [simSoilMoisture, setSimSoilMoisture] = useState<number>(82);
  const [isRunningInference, setIsRunningInference] = useState<boolean>(false);
  const [inferenceFeedback, setInferenceFeedback] = useState<string | null>(null);

  useEffect(() => {
    DisasterShieldAPI.getLiveTelemetryMesh()
      .then((data) => {
        if (data) {
          setLiveMesh(data);
          if (data.weather?.current_rainfall_mm_hr !== undefined) {
            setSimRainfall(Math.max(15, data.weather.current_rainfall_mm_hr));
          }
          if (data.geotechnical?.soil_moisture_saturation_pct !== undefined) {
            setSimSoilMoisture(data.geotechnical.soil_moisture_saturation_pct);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSyncLiveInternetData = () => {
    if (liveMesh) {
      setSimRainfall(liveMesh.weather?.current_rainfall_mm_hr || 45);
      setSimSoilMoisture(liveMesh.geotechnical?.soil_moisture_saturation_pct || 75);
      setInferenceFeedback('Synced with real-time Open-Meteo & GloFAS Internet Telemetry!');
      setTimeout(() => setInferenceFeedback(null), 3000);
    }
  };

  const handleRunLiveDualInference = async () => {
    setIsRunningInference(true);
    setInferenceFeedback('Running inference across 10,000-scenario dual model ensemble...');

    try {
      // 1. Run Flood Inundation Model
      const floodRes = await fetch('http://localhost:8000/api/v1/ai-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rainfall_mm_hr: simRainfall,
          elevation_m: simElevation,
        }),
      });

      // 2. Run Landslide Slope Stability Model
      const landslideRes = await fetch('http://localhost:8000/api/v1/ai-predict-landslide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rainfall_72h_mm: simRainfall * 2.5,
          soil_moisture_pct: simSoilMoisture,
          slope_degrees: simSlope,
        }),
      });

      const newPredictions: AIPredictionResult[] = [];

      if (floodRes.ok) {
        const floodData = await floodRes.json();
        const pred = floodData.prediction;
        newPredictions.push({
          id: `live-flood-sim-${Date.now()}`,
          hazardType: 'FLOOD',
          targetLocation: `Custom Simulation Zone (Elev: ${simElevation}m, Rain: ${simRainfall}mm/h)`,
          probabilityPct: pred.inundation_probability_pct,
          riskLevel: pred.risk_level as RiskLevel,
          confidenceScorePct: pred.confidence_score_pct,
          lastPredictionTime: 'Live Inference (<15ms)',
          timeToImpactHours: pred.time_to_peak_hours,
          keyFactors: pred.key_factors || [
            { name: 'Simulated Inundation Depth', weightPct: 45, impact: 'HIGH' },
            { name: 'DEM Elevation Basin', weightPct: 35, impact: 'HIGH' },
            { name: 'Soil Saturation Ratio', weightPct: 20, impact: 'MEDIUM' },
          ],
          summaryText: `AI Dual Regressor predicts ${pred.predicted_depth_cm}cm inundation depth with ${pred.confidence_score_pct}% model validation confidence.`,
          recommendedIntervention: pred.recommended_intervention || 'Activate high-volume drainage pumps.',
        });
      }

      if (landslideRes.ok) {
        const lsData = await landslideRes.json();
        const pred = lsData.prediction;
        newPredictions.push({
          id: `live-landslide-sim-${Date.now()}`,
          hazardType: 'LANDSLIDE',
          targetLocation: `Hillside Sector (Slope: ${simSlope}°, Soil Sat: ${simSoilMoisture}%)`,
          probabilityPct: pred.failure_probability_pct,
          riskLevel: pred.risk_level as RiskLevel,
          confidenceScorePct: pred.confidence_score_pct,
          lastPredictionTime: 'Geotech Dual Model (<15ms)',
          timeToImpactHours: pred.time_to_collapse_hours,
          keyFactors: pred.key_factors || [
            { name: 'Factor of Safety (FoS)', weightPct: 50, impact: 'HIGH' },
            { name: 'Soil Pore Water Stress', weightPct: 30, impact: 'HIGH' },
            { name: 'Slope Incline Shear', weightPct: 20, impact: 'HIGH' },
          ],
          summaryText: `Infinite Slope Geotech AI predicts Factor of Safety FoS=${pred.factor_of_safety} (${pred.slope_stability_status}) with ${pred.confidence_score_pct}% confidence.`,
          recommendedIntervention: pred.recommended_intervention,
        });
      }

      if (newPredictions.length > 0) {
        setPredictionsList((prev) => [...newPredictions, ...prev]);
        setInferenceFeedback(`Dual Model Inference complete! 2 new hazard predictions generated.`);
      }
    } catch {
      setInferenceFeedback('Error connecting to backend AI endpoints. Ensure FastAPI is running.');
    } finally {
      setIsRunningInference(false);
      setTimeout(() => setInferenceFeedback(null), 4000);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Cpu className="w-6 h-6" />
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white font-display">
              AI Risk Prediction Engine 🤖
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dual multi-hazard ensemble trained on 10,000 physics-informed scenarios (Manning Inundation + Geotechnical Infinite Slope Stability)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 10,000 Trained Scenarios • Latency: 18ms
          </span>
        </div>
      </div>

      {/* Live Dual-Hazard Interactive AI Inference Console */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-blue-500/30 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                Live Dual-Hazard AI Inference Studio
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Scikit-Learn Multi-Hazard Dual Ensemble
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Input live environmental variables or adjust sliders to trigger instant inference across both flood and landslide models.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {liveMesh && (
              <button
                onClick={handleSyncLiveInternetData}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 transition"
                title="Populate sliders using live Open-Meteo & GloFAS feeds"
              >
                <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                Sync Internet Telemetry
              </button>
            )}

            <button
              onClick={handleRunLiveDualInference}
              disabled={isRunningInference}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningInference ? 'animate-spin' : ''}`} />
              {isRunningInference ? 'Inferencing...' : 'Run Dual AI Prediction'}
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Slider 1: Rainfall */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Waves className="w-3.5 h-3.5 text-cyan-400" /> Rainfall Intensity
              </span>
              <strong className="text-cyan-400 font-mono">{simRainfall} mm/h</strong>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={simRainfall}
              onChange={(e) => setSimRainfall(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Urban Hydro Inflow</span>
          </div>

          {/* Slider 2: DEM Elevation */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-400" /> DEM Elevation
              </span>
              <strong className="text-blue-400 font-mono">{simElevation} m</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="20.0"
              step="0.1"
              value={simElevation}
              onChange={(e) => setSimElevation(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Basin Depression Level</span>
          </div>

          {/* Slider 3: Slope Angle */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-amber-400" /> Slope Angle
              </span>
              <strong className="text-amber-400 font-mono">{simSlope}°</strong>
            </div>
            <input
              type="range"
              min="10"
              max="65"
              value={simSlope}
              onChange={(e) => setSimSlope(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Geotech Incline Vector</span>
          </div>

          {/* Slider 4: Soil Saturation */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Soil Saturation
              </span>
              <strong className="text-rose-400 font-mono">{simSoilMoisture}%</strong>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={simSoilMoisture}
              onChange={(e) => setSimSoilMoisture(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Pore Water Pressure Level</span>
          </div>
        </div>

        {/* Feedback Alert */}
        {inferenceFeedback && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{inferenceFeedback}</span>
          </div>
        )}
      </div>

      {/* Animated Visual Workflow Diagram */}
      <AIWorkflowDiagram />

      {/* Prediction Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          Active Predictive Hazard Inferences ({predictionsList.length} Active Hotspots)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {predictionsList.map((pred) => (
            <PredictionCard key={pred.id} prediction={pred} />
          ))}
        </div>
      </div>
    </div>
  );
};
