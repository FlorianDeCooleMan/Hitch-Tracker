import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

interface RouteProps {
  start: [number, number]; // [lng, lat]
  end: [number, number];   // [lng, lat]
  apiKey: string;
}

interface ORSResponse {
  features: {
    geometry: { coordinates: [number, number][] };
    properties: {
      summary: { duration: number; distance: number };
      segments: { steps: { instruction: string }[] }[];
    };
  }[];
}

export default function RouteMap({ start, end, apiKey }: RouteProps) {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [info, setInfo] = useState<{ duration: number; distance: number } | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`
        );

        if (!res.ok) throw new Error("Failed to fetch route");

        const data: ORSResponse = await res.json();
        if (data.features.length > 0) {
          const coords = data.features[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng] as [number, number]
          );
          setRoute(coords);
          setInfo(data.features[0].properties.summary);
          setSteps(
            data.features[0].properties.segments.flatMap((seg) =>
              seg.steps.map((s) => s.instruction)
            )
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoute();
  }, [start, end, apiKey]);

  return (
    <div className="space-y-3">
      <MapContainer
        center={[ (start[1] + end[1]) / 2, (start[0] + end[0]) / 2 ]}
        zoom={11}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[start[1], start[0]]}>
          <Popup>Start</Popup>
        </Marker>

        <Marker position={[end[1], end[0]]}>
          <Popup>End</Popup>
        </Marker>

        {route.length > 0 && (
          <Polyline positions={route} pathOptions={{ color: "blue" }}>
            <Popup>
              {info && (
                <>
                  <div><b>Distance:</b> {(info.distance / 1000).toFixed(1)} km</div>
                  <div><b>Duration:</b> {(info.duration / 60).toFixed(0)} mins</div>
                </>
              )}
            </Popup>
          </Polyline>
        )}
      </MapContainer>

      {steps.length > 0 && (
        <div className="bg-white p-3 rounded shadow text-sm max-h-40 overflow-y-auto">
          <h3 className="font-semibold mb-2">🚗 Route Instructions</h3>
          <ol className="list-decimal list-inside space-y-1">
            {steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
