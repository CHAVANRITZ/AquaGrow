
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import api from "../services/api";

function MoistureChart() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await api.get(
          "/devices/AG-001/readings"
        );

        const formattedData = response.data.data
          .slice()
          .reverse()
          .map((reading) => ({
            time: new Date(reading.createdAt).toLocaleTimeString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit"
              }
            ),
            moisture: reading.soilMoisture
          }));

        setReadings(formattedData);
      } catch (err) {
        setError("Unable to load moisture history");
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  if (loading) return <p>Loading analytics...</p>;

  if (error) return <p>{error}</p>;

  if (readings.length < 2) {
    return (
      <div className="chart-empty">
        <p>Not enough historical readings yet.</p>
        <span>
          At least two readings are needed to display a trend.
        </span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={readings}>
        <defs>
          <linearGradient
            id="moistureGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#4C956C"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="#4C956C"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#E9EEE7"
        />

        <XAxis
          dataKey="time"
          tick={{ fill: "#87938A", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#87938A", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          unit="%"
        />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="moisture"
          stroke="#287B50"
          strokeWidth={3}
          fill="url(#moistureGradient)"
          name="Soil Moisture"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default MoistureChart;
