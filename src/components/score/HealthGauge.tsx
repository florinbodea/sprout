"use client";

import { HealthGrade } from "@/types";
import { GradeBadge } from "./GradeBadge";

// Colour that matches the grade
const GRADE_COLOUR: Record<HealthGrade, string> = {
  A: "#10b981", // emerald-500
  B: "#84cc16", // lime-500
  C: "#facc15", // yellow-400
  D: "#f97316", // orange-500
  F: "#ef4444", // red-500
};

interface HealthGaugeProps {
  score: number;       // 0–100
  grade: HealthGrade;
  size?: number;       // svg diameter in px (default 140)
}

export function HealthGauge({ score, grade, size = 140 }: HealthGaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;

  // Arc spans 240° (from 150° to 390°, i.e. –210° to 30° in standard angles)
  const ARC_DEGREES = 240;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (ARC_DEGREES / 360) * circumference;

  // Clamp score and calculate filled portion
  const clamped = Math.max(0, Math.min(100, score));
  const filled = (clamped / 100) * arcLength;

  // Rotate so the arc starts at bottom-left (150°)
  const rotation = 150;

  const color = GRADE_COLOUR[grade];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-label={`Health score ${score} out of 100`}>
        {/* Track (background arc) */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(${rotation} ${cx} ${cy})`}
        />
        {/* Filled arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(${rotation} ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>

      {/* Centre content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span
          className="font-extrabold leading-none tabular-nums"
          style={{ fontSize: size * 0.22, color }}
        >
          {clamped}
        </span>
        <GradeBadge grade={grade} size="sm" />
      </div>
    </div>
  );
}
