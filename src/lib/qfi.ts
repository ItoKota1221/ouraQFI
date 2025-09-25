import { DailyStats, NormalizationParams, WeightParams, DecayParams, ScoreEd, ScoreQfiPoint, Rank, RankBreakpoints } from "@/lib/types";

// Pure functions: 再利用可能・副作用なし

export function computeZTime(timeMinutes: number, params: NormalizationParams): number {
  const { meanTimeMinutes, stdTimeMinutes } = params;
  if (stdTimeMinutes <= 0) return 0;
  return (timeMinutes - meanTimeMinutes) / stdTimeMinutes;
}

export function computeZMoney(moneyJpy: number, params: NormalizationParams): number {
  const { meanMoneyJpy, stdMoneyJpy } = params;
  if (stdMoneyJpy <= 0) return 0;
  return (moneyJpy - meanMoneyJpy) / stdMoneyJpy;
}

export function computeEd(
  stats: DailyStats,
  norm: NormalizationParams,
  weights: WeightParams
): ScoreEd {
  const zTime = computeZTime(stats.timeMinutes, norm);
  const zMoney = computeZMoney(stats.moneyJpy, norm);
  const zEmotion = stats.emotionZ; // センサー側Z済

  const value = weights.alpha * zTime + weights.beta * zMoney + weights.gamma * zEmotion;
  return {
    date: stats.date,
    value,
    zTime,
    zMoney,
    zEmotion,
  };
}

export function computeLambdaFromHalfLifeDays(halfLifeDays: number): number {
  if (halfLifeDays <= 0) return Math.log(2) / 7; // デフォルト
  return Math.log(2) / halfLifeDays;
}

export function computeQfiSeries(eds: ScoreEd[], decay: DecayParams): ScoreQfiPoint[] {
  const lambda = computeLambdaFromHalfLifeDays(decay.halfLifeDays);
  // 時系列が日付昇順に並んでいることを仮定
  const qfi: ScoreQfiPoint[] = [];
  let prevQfi = 0;
  for (let i = 0; i < eds.length; i++) {
    const ed = eds[i];
    // 連続日と仮定して 1日あたり e^{-λ} 減衰
    const decayFactor = i === 0 ? 0 : Math.exp(-lambda);
    const current = ed.value + prevQfi * decayFactor;
    qfi.push({ date: ed.date, value: current });
    prevQfi = current;
  }
  return qfi;
}

export function rankFromQfi(latestQfi: number, bp: RankBreakpoints): Rank {
  // 降順閾値: A>=a, B>=b, C>=c, D>=d, else E
  if (latestQfi >= bp.a) return "A";
  if (latestQfi >= bp.b) return "B";
  if (latestQfi >= bp.c) return "C";
  if (latestQfi >= bp.d) return "D";
  return "E";
}



