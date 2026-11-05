"use client";
import { useReportWebVitals } from "next/web-vitals";

type Metric = {
  name: string;
  value: number;
  id: string;
  rating?: string;
  delta?: number;
  navigationType?: string;
};

const logWebVitals = (metric: Metric) => {
  if (metric.name === "TTFB") {
    console.log(`TTFB : ${metric.value}ms`);
  }
};

export function WebVitals() {
  useReportWebVitals(logWebVitals);
  return null;
}
