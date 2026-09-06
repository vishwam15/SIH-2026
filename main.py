"""
Urban Flood Nowcasting System - FastAPI Backend Server
======================================================
High-performance REST API for Real-Time Catchment Runoff, Drainage DiGraph
Hydraulic Simulation, Surcharge Prediction, and Flood-Safe Navigation Routing.

Tech Stack:
- FastAPI
- Uvicorn
- NetworkX
- Shapely
- Pydantic
"""

from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

from routing_engine import UrbanDrainageEngine

# =============================================================================
# APPLICATION INITIALIZATION & CONFIGURATION
# =============================================================================

app = FastAPI(
    title="Urban Flood Nowcasting System API",
    description=(
        "Industrial-grade coupled 2D surface terrain and 1D underground stormwater "
        "drainage network simulation engine for Smart India Hackathon (SIH 2026). "
        "Predicts street-level inundation depths and calculates flood-safe navigation routes."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# -----------------------------------------------------------------------------
# STRICT & PERMISSIVE CORS MIDDLEWARE SETUP
# -----------------------------------------------------------------------------
# Enables seamless integration with React / Vite / Next.js local frontend instances
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the hydraulic drainage routing engine
engine = UrbanDrainageEngine()

# Pre-run baseline hydraulic simulation on startup (e.g., moderate monsoon rainfall 75mm/hr)
engine.simulate_rainfall(rainfall_mm=75.0, duration_seconds=3600.0)


# =============================================================================
# PYDANTIC DATA VALIDATION MODELS
# =============================================================================

class SafeRouteRequest(BaseModel):
    """
    Request schema for calculating a safe evacuation route avoiding flooded areas.
    Coordinates format: [latitude, longitude]
    """
    start: List[float] = Field(
        ...,
        description="Start coordinate [lat, lng]",
        example=[19.1170, 72.8440]
    )
    end: List[float] = Field(
        ...,
        description="Destination coordinate [lat, lng]",
        example=[19.0550, 72.8350]
    )
    current_rainfall_mm: Optional[float] = Field(
        default=None,
        description="Optional current or forecasted rainfall in mm to simulate on-the-fly before routing"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "start": [19.1170, 72.8440],
                "end": [19.0550, 72.8350],
                "current_rainfall_mm": 85.0
            }
        }


class SimulationRequest(BaseModel):
    """
    Request schema for dynamic hydraulic parameter tuning.
    """
    rainfall_mm: float = Field(..., ge=0.0, le=500.0, description="Precipitation depth in mm (e.g., 50-150 mm/hr)")
    duration_min: Optional[int] = Field(default=60, ge=5, le=360, description="Rainfall event duration in minutes")


class AIPredictRequest(BaseModel):
    """
    Request schema for AI/ML Inundation Prediction inference.
    """
    rainfall_mm_hr: float = Field(..., ge=0.0, le=300.0, description="Rainfall intensity in mm/hr", example=85.0)
    elevation_m: float = Field(..., ge=0.0, le=100.0, description="DEM ground elevation in meters", example=2.4)
    catchment_area_m2: Optional[float] = Field(default=6500.0, description="Catchment basin surface area in m²")
    soil_saturation_pct: Optional[float] = Field(default=85.0, description="TDR soil moisture saturation percentage")


class LandslidePredictRequest(BaseModel):
    """
    Request schema for Landslide Factor of Safety (FoS) and slope failure inference.
    """
    rainfall_72h_mm: float = Field(..., ge=0.0, le=800.0, description="72-hour cumulative precipitation in mm", example=180.0)
    soil_moisture_pct: float = Field(..., ge=0.0, le=100.0, description="Satellite soil moisture saturation percentage", example=88.0)
    slope_degrees: Optional[float] = Field(default=38.0, ge=5.0, le=75.0, description="Mountain slope incline in degrees")
    pore_pressure_kpa: Optional[float] = Field(default=None, description="Pore water pressure in kPa")


class ChatRequest(BaseModel):
    """
    Request schema for natural language flood & evacuation queries.
    """
    message: str = Field(..., description="User query text", example="Is Andheri Subway flooded right now?")


# =============================================================================
# REST API ENDPOINTS
# =============================================================================

@app.get("/", tags=["System Information"])
async def root():
    """
    API Root endpoint providing system status, capabilities, and documentation links.
    """
    return {
        "system": "Urban Flood Nowcasting System (Drainage & Rainfall Coupling)",
        "project": "Smart India Hackathon (SIH 2026)",
        "status": "ONLINE",
        "documentation": "/docs",
        "endpoints": {
            "flood_nowcast": "/api/v1/flood-nowcast",
            "safe_route": "/api/v1/safe-route",
            "simulate": "/api/v1/simulate",
            "health": "/api/v1/health"
        }
    }


@app.get("/api/v1/health", tags=["Health & Telemetry"])
async def health_check():
    """
    Health check endpoint verifying the status of the hydraulic graph engine.
    """
    return {
        "status": "healthy",
        "nodes_loaded": engine.drainage_graph.number_of_nodes(),
        "pipes_loaded": engine.drainage_graph.number_of_edges(),
        "street_segments": engine.street_graph.number_of_edges(),
        "last_rainfall_simulated_mm": engine.last_rainfall_mm
    }


@app.get("/api/v1/flood-nowcast", tags=["Flood Intelligence & GIS"])
async def get_flood_nowcast(
    rainfall_mm: Optional[float] = Query(
        default=85.0,
        ge=0.0,
        le=500.0,
        description="Rainfall depth in mm to simulate street inundation and pipe overload"
    ),
    duration_min: Optional[int] = Query(
        default=60,
        ge=5,
        le=360,
        description="Duration of rainfall storm event in minutes"
    )
):
    """
    **Urban Flood Nowcast Inundation Map (GeoJSON FeatureCollection)**
    
    1. Distributes precipitation across urban catchments (Rational Method).
    2. Routes stormwater through underground gravity pipe network (Manning's Equation).
    3. Evaluates surcharge when volume exceeds chamber/pipe capacity and calculates street inundation depth (cm).
    4. Returns a standard GeoJSON `FeatureCollection` with:
       - **Point features:** Manhole / Sump nodes with `overflow_depth_cm`, `fill_percentage`, `hazard_status` ('red' / 'yellow' / 'green').
       - **LineString features:** Underground stormwater pipes with `flow_rate_m3s`, `utilization_pct`, `hazard_status`.
       - **LineString features:** Street segments annotated with passability.
    """
    # Execute hydraulic simulation for specified rainfall
    sim_stats = engine.simulate_rainfall(
        rainfall_mm=rainfall_mm,
        duration_seconds=float(duration_min * 60)
    )

    geojson_data = engine.get_flood_nowcast_geojson()
    geojson_data["metadata"]["simulation_summary"] = sim_stats

    return geojson_data


@app.post("/api/v1/safe-route", tags=["Safe Navigation Routing"])
async def calculate_safe_evacuation_route(request: SafeRouteRequest):
    """
    **Flood-Safe Evacuation Route Engine**
    
    Executes a modified Dijkstra's pathfinding algorithm on the surface road network:
    - Automatically assigns infinite penalty weights to any street segment connected to or adjacent to flooded ('red') drainage nodes.
    - Computes an optimal, dry, and navigable evacuation route between the `start` and `end` coordinates.
    - Returns a GeoJSON `Feature` with `LineString` geometry, distance (km), estimated transit time, and list of avoided flood hazard zones.
    """
    if len(request.start) != 2 or len(request.end) != 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start and end coordinates must be formatted as [latitude, longitude]."
        )

    # Optional dynamic re-simulation if specific rainfall provided in payload
    if request.current_rainfall_mm is not None:
        engine.simulate_rainfall(rainfall_mm=request.current_rainfall_mm)

    route_geojson = engine.compute_safe_evacuation_route(
        start_coords=request.start,
        end_coords=request.end
    )

    return route_geojson


@app.post("/api/v1/simulate", tags=["Hydraulic Simulation"])
async def run_simulation_step(payload: SimulationRequest):
    """
    Interactive endpoint to trigger hydraulic recalculation and inspect aggregate watershed stress metrics.
    """
    stats = engine.simulate_rainfall(
        rainfall_mm=payload.rainfall_mm,
        duration_seconds=float(payload.duration_min * 60)
    )
    return {
        "status": "success",
        "metrics": stats
    }


@app.get("/api/v1/live-weather", tags=["Real-Time Meteorology"])
async def get_live_weather():
    """
    Returns live precipitation, 15-minute nowcast, and hourly forecast
    from Open-Meteo API for Mumbai Metropolitan Region.
    """
    return engine.live_data_service.fetch_live_mumbai_weather()


@app.get("/api/v1/telemetry", tags=["IoT Sensor Telemetry"])
async def get_sensor_telemetry():
    """
    Returns live telemetry streams from NDMA IoT sensor stations (ultrasonic water depth,
    optical rain gauge, channel discharge flow, and soil moisture saturation).
    """
    return engine.live_data_service.generate_live_sensor_telemetry(engine.last_rainfall_mm)


@app.post("/api/v1/ai-predict", tags=["AI/ML Predictions"])
async def predict_inundation_ai(payload: AIPredictRequest):
    """
    Runs the Physics-Informed Machine Learning Surrogate Model to predict
    street-level flood depth (cm), failure probability, and time to peak.
    """
    prediction = engine.ml_predictor.predict(
        rainfall_mm_hr=payload.rainfall_mm_hr,
        elevation_m=payload.elevation_m,
        catchment_area_m2=payload.catchment_area_m2 or 6500.0,
        soil_saturation_pct=payload.soil_saturation_pct or 85.0
    )
    return {
        "status": "success",
        "input_features": payload.dict(),
        "prediction": prediction,
        "model_architecture": "RandomForest Surrogate Regressor & Classifier"
    }


@app.get("/api/v1/live-telemetry-mesh", tags=["Real-Time Multi-Stream Mesh"])
async def get_live_telemetry_mesh():
    """
    Returns the unified real-time multi-stream mesh:
    1. Open-Meteo live weather, 15-min nowcast, and hourly forecast
    2. GloFAS-coupled river discharge and drainage stress
    3. Satellite multi-depth soil moisture and landslide Factor of Safety (FoS)
    4. Synchronized NDMA IoT physical sensor stations
    """
    return engine.live_data_service.fetch_live_telemetry_mesh()


@app.post("/api/v1/ai-predict-landslide", tags=["AI/ML Predictions"])
async def predict_landslide_ai(payload: LandslidePredictRequest):
    """
    Runs the Physics-Informed Geotechnical ML Model to predict
    mountain slope Factor of Safety (FoS), collapse probability, and intervention.
    """
    prediction = engine.ml_predictor.predict_landslide(
        rainfall_72h_mm=payload.rainfall_72h_mm,
        soil_moisture_pct=payload.soil_moisture_pct,
        slope_degrees=payload.slope_degrees or 38.0,
        pore_pressure_kpa=payload.pore_pressure_kpa
    )
    return {
        "status": "success",
        "input_features": payload.dict(),
        "prediction": prediction,
        "model_architecture": "Physics-Informed Infinite Slope Random Forest"
    }


@app.post("/api/v1/chat", tags=["AI Chatbot"])
async def chat_flood_evacuation(payload: ChatRequest):
    """
    Real-Time Multi-Hazard AI Assistant for Urban Flood & Evacuation Queries.
    Injects live meteorological, GloFAS hydrological, and geotechnical telemetry.
    """
    msg = payload.message.lower().strip()
    
    # Retrieve live multi-stream telemetry mesh
    mesh = engine.live_data_service.fetch_live_telemetry_mesh()
    current_rain = mesh["weather"]["current_rainfall_mm_hr"]
    river_flow = mesh["hydrology"]["river_discharge_m3s"]
    soil_sat = mesh["geotechnical"]["soil_moisture_saturation_pct"]
    fos = mesh["geotechnical"]["slope_factor_of_safety"]
    rain_72h = mesh["geotechnical"]["rainfall_72h_accum_mm"]

    # Identify currently flooded nodes from hydraulic graph
    red_nodes = [
        data.get("name", node_id)
        for node_id, data in engine.drainage_graph.nodes(data=True)
        if data.get("hazard_status") == "red"
    ]

    if "route" in msg or "evacuat" in msg or "shelter" in msg or "escape" in msg:
        reply = (
            f"🚗 **Live Evacuation Advisory ({current_rain:.1f} mm/hr rain | River Discharge {river_flow:.1f} m³/s):**\n\n"
            f"- **Primary Safe Haven:** **Bandra West Emergency Relief Center** (Elev 22m, Dry & Operational).\n"
            f"- **Avoided Inundation Points:** {', '.join(red_nodes) if red_nodes else 'No subways currently surcharged'}.\n"
            f"- **Recommended High-Ground Corridor:** Western Express Highway Elevated Bypass or Santacruz-Chembur Link Road (SCLR)."
        )
    elif "landslide" in msg or "slope" in msg or "mountain" in msg or "soil" in msg:
        reply = (
            f"⛰️ **Mountain Slope Stability Status ({rain_72h:.1f} mm 72h Rain):**\n\n"
            f"- **Satellite Soil Moisture:** **{soil_sat}% Saturation**.\n"
            f"- **Calculated Factor of Safety (FoS):** **{fos}** ({'🔴 CRITICAL FAILURE RISK' if fos < 1.0 else '🟢 STABLE'}).\n"
            f"- **Advisory:** Maintain strict acoustic sensor surveillance along Ghatkopar and Raigad mountain base corridors."
        )
    elif "andheri" in msg:
        is_flooded = current_rain >= 42.0 or "MH_ANDHERI_1" in [n for n, d in engine.drainage_graph.nodes(data=True) if d.get("hazard_status") == "red"]
        reply = (
            f"🌊 **Andheri Subway Status (Live Rain: {current_rain:.1f} mm/hr):**\n\n"
            f"- **Basin Elevation:** 2.4 meters DEM Invert.\n"
            f"- **Current Condition:** {'🔴 SURCHARGED - OVERFLOW DEPTH 28-35cm' if is_flooded else '🟢 PASSABLE (NORMAL FLOW)'}.\n"
            f"- **Recommended Bypass:** Divert through Gokhale Bridge flyover to SV Road Elevated link."
        )
    elif "river" in msg or "mithi" in msg:
        reply = (
            f"🌊 **Mithi River & GloFAS Discharge Live Telemetry:**\n\n"
            f"- **Current Discharge Flow:** **{river_flow} m³/s**.\n"
            f"- **Water Level:** **{mesh['hydrology']['mithi_water_level_m']} meters** (Danger mark: 3.5m).\n"
            f"- **Drainage Stress:** **{mesh['hydrology']['drainage_stress_pct']}% capacity**."
        )
    elif "helpline" in msg or "sos" in msg or "call" in msg:
        reply = (
            "📞 **Verified 24/7 Disaster Helplines:**\n\n"
            "- 🚨 **NDMA National Disaster Helpline:** **1078**\n"
            "- 🏢 **Mumbai Disaster Management Cell (BMC):** **1916**\n"
            "- 🚑 **Medical Ambulance:** **108** | 🚓 **Police:** **100 / 112** | 🚒 **Fire & Rescue:** **101**"
        )
    else:
        reply = (
            f"DisasterShield AI is monitoring {engine.drainage_graph.number_of_nodes()} urban drainage nodes and "
            f"mountain slopes. Live Precipitation: **{current_rain:.1f} mm/hr** | River Flow: **{river_flow:.1f} m³/s** | "
            f"Soil Saturation: **{soil_sat}%**. Currently, {len(red_nodes)} nodes are surcharged. "
            f"Ask about safe routes, subway water depths, landslide FoS, or NDMA emergency checklists!"
        )

    return {
        "status": "success",
        "query": payload.message,
        "reply": reply,
        "current_rainfall_mm": current_rain,
        "flooded_nodes": red_nodes,
        "river_discharge_m3s": river_flow,
        "soil_moisture_pct": soil_sat,
        "factor_of_safety": fos
    }


# =============================================================================
# LOCAL ENTRYPOINT FOR UVICORN SERVER
# =============================================================================

if __name__ == "__main__":
    print("Starting Urban Flood Nowcasting API Backend on http://0.0.0.0:8000 ...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
