import { HealthGrade } from "@/types";
import { cn } from "@/lib/utils";

const GRADE_STYLES: Record<HealthGrade, string> = {
  A: "bg-emerald-500 text-white",
  B: "bg-lime-500 text-white",
  C: "bg-yellow-400 text-gray-900",
  D: "bg-orange-500 text-white",
  F: "bg-red-500 text-white",
};

const SIZE_STYLES = {
  sm: "w-7 h-7 text-sm font-bold",
  md: "w-10 h-10 text-lg font-bold",
  lg: "w-14 h-14 text-2xl font-extrabold",
};

interface GradeBadgeProps {
  grade: HealthGrade;
  size?: keyof typeof SIZE_STYLES;
  className?: string;
}

export function GradeBadge({ grade, size = "md", className }: GradeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full shadow-sm select-none",
        GRADE_STYLES[grade],
        SIZE_STYLES[size],
        className
      )}
      aria-label={`Health grade ${grade}`}
    >
      {grade}
    </span>
  );
}
