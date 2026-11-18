
function SensorCard({ title, value, unit, icon, color, status }) {
  return (
    <div className="sensor-card">
      <div className="sensor-card-top">
        <div
          className="sensor-icon"
          style={{ background: color + "18", color }}
        >
          {icon}
        </div>

        {status && (
          <span className="sensor-status">{status}</span>
        )}
      </div>

      <p className="sensor-title">{title}</p>

      <h2 className="sensor-value">
        {value}
        <span>{unit}</span>
      </h2>

      <p className="sensor-description">Latest sensor reading</p>
    </div>
  );
}

export default SensorCard;
