import { useState, useEffect } from "react";
import TripInfo from "./components/TripInfo";
import DriverCard from "./components/DriverCard";
import RouteMap from "./components/RouteMap";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState(0);
  const [tracking, setTracking] = useState(false);

  const tripData = {
    origin: "Amsterdam Centraal",
    destination: "Schiphol Airport",
    estimatedTime: 35,
    driver: {
      name: "Mohammed Hassan",
      rating: 4.8,
      imageUrl: "https://i.pravatar.cc/150?img=12",
      carModel: "Toyota Prius",
      licensePlate: "1-ABC-23",
    },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (tracking && currentTime < tripData.estimatedTime) {
      interval = setInterval(() => {
        setCurrentTime((prev) =>
          prev < tripData.estimatedTime ? prev + 1 : prev
        );
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tracking, currentTime, tripData.estimatedTime]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          <div className="flex items-center gap-2">
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

      {/* Tabs */}
      <main className="container mx-auto p-4">
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

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div className="grid gap-4 md:grid-cols-2">
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
            </div>
            <RouteMap
              // Amsterdam Centraal
              start={[4.9003, 52.3784]}
              // Schiphol Airport
              end={[4.7634, 52.3105]}
              apiKey="eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImQ1NjE4NmMyMTExMDRiMTA5NzE2ZjgxMDg3Mjk2MWMzIiwiaCI6Im11cm11cjY0In0="
            />
          </div>
        )}

        {activeTab === "safety" && (
          <div className="p-4 bg-white border rounded">🔒 Veiligheid</div>
        )}
        {activeTab === "costs" && (
          <div className="p-4 bg-white border rounded">💶 Kosten</div>
        )}
        {activeTab === "history" && (
          <div className="p-4 bg-white border rounded">🕒 Geschiedenis</div>
        )}
      </main>
    </div>
  );
}
