"use client";

import dynamic from "next/dynamic";

const TrendChart = dynamic(() => import("./TrendChart"), {
  ssr: false,
  loading: () => <div className="mt-8 h-40 bg-gray-50 rounded animate-pulse" />,
});

interface ScorePoint {
  date: string;
  health_score: number;
  status_label: string;
}

export default function TrendChartWrapper({ data }: { data: ScorePoint[] }) {
  return <TrendChart data={data} />;
}
