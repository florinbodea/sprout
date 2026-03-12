import { Allergen } from "@/types";
import { Chip, ALLERGENS } from "@/lib/profileOptions";

interface StepAllergensProps {
  value: Allergen[];
  onChange: (updated: Allergen[]) => void;
}

export function StepAllergens({ value, onChange }: StepAllergensProps) {
  function toggle(allergen: Allergen) {
    onChange(value.includes(allergen) ? value.filter((a) => a !== allergen) : [...value, allergen]);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Any allergens to avoid?</h2>
        <p className="text-sm text-gray-400 mt-1">
          Products containing these will show a warning and score penalty.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALLERGENS.map(({ value: v, label }) => (
          <Chip
            key={v}
            label={label}
            selected={value.includes(v)}
            onClick={() => toggle(v)}
          />
        ))}
      </div>
      {value.length === 0 && (
        <p className="text-xs text-gray-400 italic">No allergens selected — you can skip this step.</p>
      )}
    </div>
  );
}
