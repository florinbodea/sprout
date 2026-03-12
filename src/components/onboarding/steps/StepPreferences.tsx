import { DietaryPreference } from "@/types";
import { Chip, PREFERENCES } from "@/lib/profileOptions";

interface StepPreferencesProps {
  value: DietaryPreference[];
  onChange: (updated: DietaryPreference[]) => void;
}

export function StepPreferences({ value, onChange }: StepPreferencesProps) {
  function toggle(pref: DietaryPreference) {
    onChange(value.includes(pref) ? value.filter((p) => p !== pref) : [...value, pref]);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dietary preferences</h2>
        <p className="text-sm text-gray-400 mt-1">
          We&apos;ll highlight products that fit your lifestyle.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {PREFERENCES.map(({ value: v, label, icon }) => (
          <Chip
            key={v}
            label={label}
            icon={icon}
            selected={value.includes(v)}
            onClick={() => toggle(v)}
          />
        ))}
      </div>
      {value.length === 0 && (
        <p className="text-xs text-gray-400 italic">No preferences selected — you can skip this step.</p>
      )}
    </div>
  );
}
