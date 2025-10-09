interface TripInfoProps {
  origin: string;
  destination: string;
  estimatedTime: number;
  currentTime: number;
  onStart: () => void;
}

export default function TripInfo({
  origin,
  destination,
  estimatedTime,
  currentTime,
  onStart,
}: TripInfoProps) {
  return (
    <div className="card trip-info">
      <h3>Rit Informatie</h3>
      <p>
        <strong>Van:</strong> {origin}
      </p>
      <p>
        <strong>Naar:</strong> {destination}
      </p>

      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${(currentTime / estimatedTime) * 100}%` }}
        ></div>
      </div>

      <div className="trip-times">
        <span>Geschat: {estimatedTime}m</span>
        <span>Huidige tijd: {currentTime}m</span>
      </div>

      <button className="btn" onClick={onStart}>
        ▶ Start Tracking
      </button>
    </div>
  );
}
