import { create } from "zustand";
import dayjs from "dayjs";
import { DailyStats, NormalizationParams, WeightParams, DecayParams, ScoreEd, ScoreQfiPoint, RankBreakpoints, Rank } from "@/lib/types";
import { appConfig } from "@/lib/config";
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
  addDaily: (input: Omit<DailyStats, "date"> & { date?: string }) => void;
  recompute: () => void;
  reset: () => void;
};

const defaultNorm: NormalizationParams = {
  meanTimeMinutes: 60,
  stdTimeMinutes: 30,
  meanMoneyJpy: 1000,
  stdMoneyJpy: 800,
};

const defaultWeights: WeightParams = {
  alpha: appConfig.qfi.alpha,
  beta: appConfig.qfi.beta,
  gamma: appConfig.qfi.gamma,
};
const defaultDecay: DecayParams = { halfLifeDays: appConfig.qfi.halfLifeDays };
const defaultRanks: RankBreakpoints = { a: 8, b: 4, c: 2, d: 0 };

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
    const date = input.date ?? dayjs().format("YYYY-MM-DD");
    const nextDaily: DailyStats = {
      date,
      timeMinutes: input.timeMinutes,
      moneyJpy: input.moneyJpy,
      emotionZ: input.emotionZ,
    };
    set((s) => ({ daily: [...s.daily, nextDaily] }));
    get().recompute();
  },
  recompute: () => {
    const { daily, norm, weights, decay, ranks } = get();
    const sorted = [...daily].sort((a, b) => a.date.localeCompare(b.date));
    const eds = sorted.map((d) => computeEd(d, norm, weights));
    const qfi = computeQfiSeries(eds, decay);
    const latest = qfi.at(-1)?.value ?? 0;
    const latestRank = rankFromQfi(latest, ranks);
    set({ eds, qfi, latestRank });
  },
  reset: () => set({ daily: [], eds: [], qfi: [], latestRank: undefined }),
}));


