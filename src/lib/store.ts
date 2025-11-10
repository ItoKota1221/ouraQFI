import { create } from "zustand";
import { DailyStats, NormalizationParams, WeightParams, DecayParams, ScoreEd, ScoreQfiPoint, RankBreakpoints, Rank } from "@/lib/types";
import { computeEd, computeQfiSeries, rankFromQfi } from "@/lib/qfi";

export type AppState = {
  norm: NormalizationParams;
  weights: WeightParams;
  decay: DecayParams;
  ranks: RankBreakpoints;
  daily: DailyStats[];
  eds: ScoreEd[];
  qfi: ScoreQfiPoint[];
  latestRank?: Rank;
  addDaily: (input: DailyStats | DailyStats[]) => void;
  recompute: () => void;
  reset: () => void;
  setParams: (p: Partial<{
    norm: NormalizationParams;
    weights: WeightParams;
    decay: DecayParams;
    ranks: RankBreakpoints;
  }>) => void;
};

const defaultNorm: NormalizationParams = {
  muTime: 60,
  sigmaTime: 20,
  muMoney: 1000,
  sigmaMoney: 400,
};

const defaultWeights: WeightParams = {
  alpha: 1,
  beta: 1,
  gamma: 1,
};

const defaultDecay: DecayParams = {
  halfLifeDays: 14,
};

const defaultRanks: RankBreakpoints = {
  A: 9,
  B: 7,
  C: 5,
  D: 3,
};

export const useAppStore = create<AppState>((set, get) => ({
  norm: defaultNorm,
  weights: defaultWeights,
  decay: defaultDecay,
  ranks: defaultRanks,
  daily: [],
  eds: [],
  qfi: [],
  latestRank: undefined,

  addDaily: (input) => {
    const arr = Array.isArray(input) ? input : [input];
    set((s) => ({ daily: [...s.daily, ...arr] }));
    get().recompute();
  },

  recompute: () => {
    const { daily, norm, weights, decay, ranks } = get();
    const sorted = [...daily].sort((a, b) => a.date.localeCompare(b.date));
    const eds = computeEd(sorted, { norm, weights });
    const qfi = computeQfiSeries(eds, decay);
    const latest = qfi.at(-1)?.qfi ?? 0;
    const latestRank = rankFromQfi(latest, ranks);
    set({ eds, qfi, latestRank });
  },

  reset: () => set({ daily: [], eds: [], qfi: [], latestRank: undefined }),

  setParams: (p) => {
    set(p);
    get().recompute();
  },
}));
