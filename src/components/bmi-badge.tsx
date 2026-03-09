"use client";

import { Badge } from "@/components/ui/badge";
import { IMCTooltip } from "@/components/imc-tooltip";
import {
  getBMIClassification,
  type BMICategory,
} from "@/lib/bmi";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/locale-context";

export const bmiCategoryVariants: Record<BMICategory, string> = {
  underweight: "bg-sky-500/20 text-sky-700 dark:text-sky-300",
  normal: "bg-green-500/20 text-green-700 dark:text-green-300",
  overweight: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  obesity1: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  obesity2: "bg-red-500/20 text-red-700 dark:text-red-300",
  obesity3: "bg-red-700/30 text-red-800 dark:text-red-200",
};

type BMIBadgeProps = {
  bmi: number;
  className?: string;
  showDescription?: boolean;
};

const BMI_DESC_KEYS: Record<BMICategory, string> = {
  underweight: "bmi.belowRecommended",
  normal: "bmi.healthyRange",
  overweight: "bmi.aboveIdeal",
  obesity1: "bmi.seeDoctor",
  obesity2: "bmi.consultProfessional",
  obesity3: "bmi.specializedCare",
};

export function BMIBadge({ bmi, className, showDescription }: BMIBadgeProps) {
  const { t } = useTranslation();
  const classification = getBMIClassification(bmi);
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2 flex-wrap">
        <IMCTooltip triggerIcon>
          <span className="text-sm text-muted-foreground">IMC:</span>
        </IMCTooltip>
        <span className="font-semibold">{bmi}</span>
        <Badge
          variant="secondary"
          className={cn("font-medium", bmiCategoryVariants[classification.category])}
        >
          {t(`bmi.${classification.category}`)}
        </Badge>
      </div>
      {showDescription && (
        <p className="text-xs text-muted-foreground">{t(BMI_DESC_KEYS[classification.category])}</p>
      )}
    </div>
  );
}
