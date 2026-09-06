import React, { useState, useEffect } from 'react';
import { DisasterShieldAPI } from '../services/api';
import type { AIPredictionResult } from '../types';
import { AIWorkflowDiagram } from '../components/ai/AIWorkflowDiagram';
import { PredictionCard } from '../components/ai/PredictionCard';
import { Cpu, Sparkles, Layers, Activity } from 'lucide-react';

interface AIPredictionProps {
  predictions: AIPredictionResult[];
}

export const AIPrediction: React.FC<AIPredictionProps> = ({ predictions }) => {
  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLivePrediction = async () => {
      const data = await DisasterShieldAPI.getFastAPIPrediction(65.0, 85.0, 3.2);
      if (data) {
        setLiveData(data);
      }
      setLoading(false);
    };

    fetchLivePrediction();
  }, []);

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
            Deep learning multi-hazard classification engine combining ResNet-LSTM & XGBoost models
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Model Inference Latency: 24ms
          </span>
        </div>
      </div>

      {/* Live FastAPI Backend Connection Banner */}
      <div className="p-4 bg-slate-900/80 border border-emerald-500/40 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
            Live Python Backend Integration (Uvicorn Port 8000)
          </h3>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400">Connecting to local XGBoost & LSTM models...</p>
        ) : liveData ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <p className="text-slate-400">XGBoost Risk Tier</p>
              <p className="text-lg font-extrabold text-amber-400 mt-0.5">
                {liveData.xgboost_risk_level}
              </p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <p className="text-slate-400">LSTM Predicted Depth</p>
              <p className="text-lg font-extrabold text-cyan-400 mt-0.5">
                {liveData.predicted_water_depth_cm} cm
              </p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <p className="text-slate-400">Input Telemetry</p>
              <p className="text-slate-200 font-medium mt-0.5">
                Rain: {liveData.input_telemetry?.rainfall_mm}mm | Tide: {liveData.input_telemetry?.tide_level_m}m
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-rose-400 font-medium">
            ⚠️ Unable to connect to FastAPI server at http://127.0.0.1:8000. Ensure uvicorn is running.
          </p>
        )}
      </div>

      {/* Animated Visual Workflow Diagram */}
      <AIWorkflowDiagram />

      {/* Prediction Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          Active Predictive Hazard Inferences
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {predictions?.map((pred) => (
            <PredictionCard key={pred.id} prediction={pred} />
          ))}
        </div>
      </div>
    </div>
  );
};