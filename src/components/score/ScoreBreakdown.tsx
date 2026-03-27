import { HealthScore } from "@/types";
import { cn } from "@/lib/utils";

interface BarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

function Bar({ label, value, max, color }: BarProps) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span className="tabular-nums font-medium text-gray-700">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface ScoreBreakdownProps {
  healthScore: HealthScore;
  className?: string;
}

export function ScoreBreakdown({ healthScore, className }: ScoreBreakdownProps) {
  const { breakdown, warnings } = healthScore;

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Score Breakdown
      </h3>

      <div className="space-y-3">
        <Bar
          label="Nutri-Score"
          value={breakdown.nutriScore}
          max={25}
          color="bg-emerald-400"
        />
        <Bar
          label="Processing (NOVA)"
          value={breakdown.nova}
          max={25}
          color="bg-sky-400"
        />
        <Bar
          label="Nutrition"
          value={breakdown.nutrition}
          max={30}
          color="bg-violet-400"
        />
        <Bar
          label="Your Profile"
          value={breakdown.profileBonus}
          max={20}
          color="bg-amber-400"
        />
      </div>

      {warnings.length > 0 && (
        <div className="space-y-1 pt-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Heads up
          </p>
          <ul className="space-y-1">
            {warnings.map((w) => (
              <li
                key={w}
                className="flex items-center gap-1.5 text-xs text-orange-700 bg-orange-50 rounded-md px-2 py-1"
              >
                <span aria-hidden>⚠️</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
