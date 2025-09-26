interface MapViewProps {
  origin: string;
  destination: string;
  progress: number;
}

export default function MapView({
  origin,
  destination,
  progress,
}: MapViewProps) {
  return (
    <div className="card map-view">
      <h3>Live Route Tracking</h3>
      <div className="map-placeholder">
        {origin} → {destination}
      </div>
      <div className="map-progress">{progress}% voltooid</div>
    </div>
  );
}
