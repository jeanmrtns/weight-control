/**
 * Calcula IMC: peso (kg) / (altura em m)²
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export type BMICategory =
  | "underweight"
  | "normal"
  | "overweight"
  | "obesity_1"
  | "obesity_2"
  | "obesity_3";

export interface BMIClassification {
  category: BMICategory;
  label: string;
  description: string;
}

/**
 * Classificação OMS para IMC (adultos)
 */
export function getBMIClassification(bmi: number): BMIClassification {
  if (bmi < 18.5)
    return {
      category: "underweight",
      label: "Abaixo do peso",
      description: "IMC abaixo do recomendado. Considere acompanhamento nutricional.",
    };
  if (bmi < 25)
    return {
      category: "normal",
      label: "Peso normal",
      description: "Peso dentro da faixa considerada saudável.",
    };
  if (bmi < 30)
    return {
      category: "overweight",
      label: "Sobrepeso",
      description: "Acima do peso ideal. Cuidado com calorias e atividade física.",
    };
  if (bmi < 35)
    return {
      category: "obesity_1",
      label: "Obesidade Grau I",
      description: "Recomenda-se acompanhamento médico e nutricional.",
    };
  if (bmi < 40)
    return {
      category: "obesity_2",
      label: "Obesidade Grau II",
      description: "Consulte um profissional de saúde para um plano adequado.",
    };
  return {
    category: "obesity_3",
    label: "Obesidade Grau III",
    description: "É importante buscar orientação médica especializada.",
  };
}

/**
 * Tendência com base nos últimos N registros (peso)
 * Retorna: "up" | "down" | "stable"
 */
export function getWeightTrend(weights: number[], minPoints = 2): "up" | "down" | "stable" {
  if (weights.length < minPoints) return "stable";
  const recent = weights.slice(-minPoints);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const diff = last - first;
  if (Math.abs(diff) < 0.5) return "stable";
  return diff > 0 ? "up" : "down";
}
