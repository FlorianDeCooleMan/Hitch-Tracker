interface Driver {
  name: string;
  rating: number;
  imageUrl: string;
  carModel: string;
  licensePlate: string;
}

export default function DriverCard({ driver }: { driver: Driver }) {
  return (
    <div className="card driver-card">
      <img src={driver.imageUrl} alt={driver.name} className="driver-image" />
      <div className="driver-info">
        <h4>{driver.name}</h4>
        <p>⭐ {driver.rating}</p>
        <p>
          {driver.carModel} • {driver.licensePlate}
        </p>
      </div>
      <span className="badge green">Geverifieerd</span>
    </div>
  );
}
