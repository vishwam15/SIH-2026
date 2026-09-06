import json
from routing_engine import UrbanDrainageEngine

def test():
    engine = UrbanDrainageEngine()
    print("Testing multi-tier dynamic flood routing:")
    for rain in [30.0, 55.0, 95.0, 140.0]:
        engine.simulate_rainfall(rainfall_mm=rain)
        route = engine.compute_safe_evacuation_route([19.1170, 72.8440], [19.0550, 72.8350])
        props = route["properties"]
        print(f"\n--- RAINFALL: {rain} mm/hr ---")
        print("Path:", " -> ".join(props["path_node_sequence"]))
        print(f"Distance: {props['distance_km']} km | ETA: {props['estimated_time_min']} mins")
        print(f"Passages: {props['safe_passages']}")
        print(f"Avoided Floods ({len(props['avoided_flooded_zones'])}): {props['avoided_flooded_zones'][:3]}...")

if __name__ == "__main__":
    test()
