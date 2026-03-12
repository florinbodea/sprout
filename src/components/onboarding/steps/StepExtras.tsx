import { Toggle } from "@/lib/profileOptions";

interface StepExtrasProps {
  avoidAdditives: boolean;
  preferOrganic: boolean;
  onChangeAdditives: (v: boolean) => void;
  onChangeOrganic: (v: boolean) => void;
}

export function StepExtras({
  avoidAdditives,
  preferOrganic,
  onChangeAdditives,
  onChangeOrganic,
}: StepExtrasProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Fine-tune your scores</h2>
        <p className="text-sm text-gray-400 mt-1">
          Optional adjustments that sharpen your personalised health scores.
        </p>
      </div>
      <div className="space-y-3">
        <Toggle
          label="Avoid additives"
          description="Penalises ultra-processed (NOVA 4) products more heavily."
          checked={avoidAdditives}
          onChange={onChangeAdditives}
        />
        <Toggle
          label="Prefer organic"
          description="Boosts the score of organically labelled products."
          checked={preferOrganic}
          onChange={onChangeOrganic}
        />
      </div>
    </div>
  );
}
