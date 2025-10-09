import { useState, useEffect } from "react";
import TripInfo from "./components/TripInfo";
import DriverCard from "./components/DriverCard";
import RouteMap from "./components/RouteMap";
import LocationInput from "./components/LocationInput";

export default function App() {
  // Current active tab (Dashboard, Safety, etc.)
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState(0);
  const [tracking, setTracking] = useState(false);

  // Route info (displayed and used in map)
  const [origin, setOrigin] = useState("Amsterdam Centraal");
  const [destination, setDestination] = useState("Schiphol Airport");
  const [startCoords, setStartCoords] = useState<[number, number] | null>([4.9003, 52.3784]);
  const [endCoords, setEndCoords] = useState<[number, number] | null>([4.7634, 52.3105]);

  // Temporary/pending input values before confirmation
  const [pendingOrigin, setPendingOrigin] = useState(origin);
  const [pendingDestination, setPendingDestination] = useState(destination);
  const [pendingStart, setPendingStart] = useState<[number, number] | null>(startCoords);
  const [pendingEnd, setPendingEnd] = useState<[number, number] | null>(endCoords);

  // 🔑 Your OpenRouteService API Key (hardcoded for now)
  // hier is de link. https://openrouteservice.org
  //je kan makkelijk een gratis account aan maken. gratis account is 2000request per dag
  const API_KEY =
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImQ1NjE4NmMyMTExMDRiMTA5NzE2ZjgxMDg3Mjk2MWMzIiwiaCI6Im11cm11cjY0In0=";

  // Static trip data (for driver and trip info cards)
  const tripData = {
    origin,
    destination,
    estimatedTime: 35,
    driver: {
      name: "Mohammed Hassan",
      rating: 4.8,
      imageUrl: "https://i.pravatar.cc/150?img=12",
      carModel: "Toyota Prius",
      licensePlate: "1-ABC-23",
    },
  };

  /**
   * When user clicks "Route bijwerken" (Update Route)
   * -> Replace the current route info with the pending one
   * -> The map automatically updates with new coordinates
   */
  const handleUpdateRoute = () => {
    if (pendingStart && pendingEnd) {
      setOrigin(pendingOrigin);
      setDestination(pendingDestination);
      setStartCoords(pendingStart);
      setEndCoords(pendingEnd);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------- HEADER ---------- */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "#111827",
                  color: "#fff",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🚗
              </div>
              <div>
                <h1>HitchTracker</h1>
                <p>Veilig & Transparant Reizen</p>
              </div>
            </div>
            <span
              className="badge green"
              style={{ border: "1px solid #a7f3d0" }}
            >
              Beveiligd
            </span>
          </div>

          {/* Status + logout */}
          <div className="flex items-center gap-2">
            <span className="text-green-600 border px-3 py-1 rounded text-sm">
              ✅ Beveiligd
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("ht_logged_in");
                window.location.href = "/";
              }}
              className="btn logout-btn"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="container mx-auto p-4">
        {/* Top navigation tabs */}
        <div className="flex gap-2 mb-4">
          {["dashboard", "safety", "costs", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn tab-btn py-2 rounded ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab === "dashboard" && "📊 Dashboard"}
              {tab === "safety" && "🛡️ Veiligheid"}
              {tab === "costs" && "💰 Kosten"}
              {tab === "history" && "⏳ Geschiedenis"}
            </button>
          ))}
        </div>

        {/* ----------- DASHBOARD TAB ----------- */}
        {activeTab === "dashboard" && (
          <div className="grid gap-4 md:grid-cols-2">
            {/* LEFT PANEL — trip info and inputs */}
            <div className="space-y-4">
              <TripInfo
                origin={tripData.origin}
                destination={tripData.destination}
                estimatedTime={tripData.estimatedTime}
                currentTime={currentTime}
                onStart={() => {
                  setTracking(true);
                  setCurrentTime(0);
                }}
              />

              <DriverCard driver={tripData.driver} />

              {/* Autocomplete route picker */}
              <div className="bg-white border rounded p-4 space-y-3">
                <h2 className="font-semibold mb-2">🧭 Kies Route</h2>

                {/* Origin input */}
                <LocationInput
                  label="Vertrekpunt"
                  value={pendingOrigin}
                  apiKey={API_KEY}
                  onSelect={(place) => {
                    setPendingOrigin(place.name);
                    setPendingStart(place.coords);
                  }}
                />

                {/* Destination input */}
                <LocationInput
                  label="Bestemming"
                  value={pendingDestination}
                  apiKey={API_KEY}
                  onSelect={(place) => {
                    setPendingDestination(place.name);
                    setPendingEnd(place.coords);
                  }}
                />

                {/* Update button (disabled until valid) */}
                <button
                  onClick={handleUpdateRoute}
                  disabled={!pendingStart || !pendingEnd}
                  className={`w-full py-2 mt-2 rounded font-medium ${
                    pendingStart && pendingEnd
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Route bijwerken
                </button>
              </div>
            </div>

            {/* RIGHT PANEL — map display */}
            <div className="bg-white border rounded p-2">
              {startCoords && endCoords ? (
                <RouteMap start={startCoords} end={endCoords} apiKey={API_KEY} />
              ) : (
                <div className="text-center text-gray-500 py-10">
                  🗺️ Kies locaties en klik op <b>Route bijwerken</b> om de kaart te laden
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
