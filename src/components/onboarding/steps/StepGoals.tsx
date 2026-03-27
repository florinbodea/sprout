import { DietaryGoal } from "@/types";
import { Chip, GOALS } from "@/lib/profileOptions";

interface StepGoalsProps {
  value: DietaryGoal[];
  onChange: (updated: DietaryGoal[]) => void;
}

export function StepGoals({ value, onChange }: StepGoalsProps) {
  function toggle(goal: DietaryGoal) {
    onChange(value.includes(goal) ? value.filter((g) => g !== goal) : [...value, goal]);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">What are your health goals?</h2>
        <p className="text-sm text-gray-400 mt-1">
          Select all that apply — your scores will be weighted accordingly.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {GOALS.map(({ value: v, label, icon }) => (
          <Chip
            key={v}
            label={label}
            icon={icon}
            selected={value.includes(v)}
            onClick={() => toggle(v)}
          />
        ))}
      </div>
    </div>
  );
}
