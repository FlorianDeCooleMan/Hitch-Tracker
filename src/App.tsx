import { useState } from "react";
import TripInfo from "./components/TripInfo";
import DriverCard from "./components/DriverCard";
import RouteMap from "./components/RouteMap";

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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
              🚗
            </div>
            <div>
              <h1 className="font-semibold">HitchTracker</h1>
              <p className="text-sm text-gray-500">
                Veilig & Transparant Reizen
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 border px-3 py-1 rounded text-sm">✅ Beveiligd</span>
            <button
              onClick={() => {
                localStorage.removeItem("ht_logged_in");
                // soft redirect back to login
                window.location.href = "/";
              }}
              className="border px-3 py-1 rounded text-sm"
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
