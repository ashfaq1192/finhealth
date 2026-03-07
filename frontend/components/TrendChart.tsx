"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface ScorePoint {
  date: string;
  health_score: number;
  status_label: string;
}

interface TrendChartProps {
  data: ScorePoint[];
}

const LABEL_COLORS: Record<string, string> = {
  Optimal: "#16a34a",
  Moderate: "#d97706",
  Risky: "#ea580c",
  Critical: "#dc2626",
};

function formatShortDate(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${parseInt(month)}/${parseInt(day)}`;
}

interface TooltipPayload {
  value: number;
  payload: ScorePoint;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  const { value, payload: point } = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700">{label}</p>
      <p style={{ color: LABEL_COLORS[point.status_label] ?? "#374151" }}>
        Score: {value} — {point.status_label}
      </p>
    </div>
  );
}

export default function TrendChart({ data }: TrendChartProps) {
  if (data.length < 2) return null;

  const chartData = [...data]
    .reverse()
    .map((d) => ({ ...d, shortDate: formatShortDate(d.date) }));

  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
        30-Day Trend
      </h2>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
          <XAxis
            dataKey="shortDate"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={75} stroke="#e5e7eb" strokeDasharray="4 2" />
          <ReferenceLine y={50} stroke="#e5e7eb" strokeDasharray="4 2" />
          <ReferenceLine y={25} stroke="#e5e7eb" strokeDasharray="4 2" />
          <Line
            type="monotone"
            dataKey="health_score"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
