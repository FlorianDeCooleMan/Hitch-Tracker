import { useState } from "react";
import TripInfo from "./components/TripInfo";
import MapView from "./components/MapView";
import DriverCard from "./components/DriverCard";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tripData = {
    origin: "Amsterdam Centraal",
    destination: "Schiphol Airport",
    estimatedTime: 35,
    currentTime: 0,
    driver: {
      name: "Mohammed Hassan",
      rating: 4.8,
      imageUrl: "https://i.pravatar.cc/150?img=12",
      carModel: "Toyota Prius",
      licensePlate: "1-ABC-23",
    },
  };

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
              className={`flex-1 py-2 rounded ${
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
                currentTime={tripData.currentTime}
              />
              <DriverCard driver={tripData.driver} />
            </div>
            <MapView
              origin={tripData.origin}
              destination={tripData.destination}
              progress={0}
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
