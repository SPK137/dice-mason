export interface RollFormula {
  dice: { type: string; count: number }[];
  modifier: number;
  advantage?: boolean;
  disadvantage?: boolean;
  keepHighest?: number;
  keepLowest?: number;
  label?: string;
}

export interface DieResult {
  type: string;
  value: number;
  dropped: boolean;
  isCriticalMax: boolean;
  isCriticalMin: boolean;
}

export interface RollResult {
  id: string;
  formula: RollFormula;
  results: DieResult[];
  modifier: number;
  total: number;
  timestamp: string;
  isCriticalSuccess: boolean;
  isCriticalFail: boolean;
}

export interface Macro {
  id: string;
  label: string;
  formula: RollFormula;
}