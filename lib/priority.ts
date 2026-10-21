/**
 * Idea Priority Engine
 * Formula: Score = 20 * (0.40 * GoalFit + 0.25 * CustomerValue + 0.20 * Reach + 0.15 * Ease)
 * Scale: 1 to 5 for each factor -> Total Score: 0 to 100
 * Guardrail: If ANY factor is missing, return null ("Not Rated")
 */

export interface PriorityFactors {
  goalFit?: number;
  customerValue?: number;
  reach?: number;
  ease?: number;
}

export function calculatePriorityScore(factors: PriorityFactors): number | null {
  const { goalFit, customerValue, reach, ease } = factors;
  
  if (
    typeof goalFit !== 'number' || goalFit < 1 || goalFit > 5 ||
    typeof customerValue !== 'number' || customerValue < 1 || customerValue > 5 ||
    typeof reach !== 'number' || reach < 1 || reach > 5 ||
    typeof ease !== 'number' || ease < 1 || ease > 5
  ) {
    return null; // Not Rated
  }

  const raw = 20 * (
    0.40 * goalFit +
    0.25 * customerValue +
    0.20 * reach +
    0.15 * ease
  );

  return Math.round(raw * 10) / 10;
}

export function getPriorityTier(score: number | null): {
  label: string;
  badgeClass: string;
  isActionable: boolean;
} {
  if (score === null) {
    return {
      label: 'لسة ماتقيمتش',
      badgeClass: 'bg-sand-200 text-charcoal-muted border-sand-border',
      isActionable: false,
    };
  }

  if (score >= 80) {
    return {
      label: 'أولوية دهب (80+) 🚀',
      badgeClass: 'bg-falcon-50 text-falcon-600 border-falcon-100 font-bold',
      isActionable: true,
    };
  }

  if (score >= 60) {
    return {
      label: 'أولوية متوسطة (60+)',
      badgeClass: 'bg-gold-light text-gold-dark border-amber-200 font-semibold',
      isActionable: true,
    };
  }

  return {
    label: 'أولوية منخفضة',
    badgeClass: 'bg-sand-100 text-charcoal-muted border-sand-border',
    isActionable: false,
  };
}
