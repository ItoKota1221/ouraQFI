export type InputSample = {
  timestampIso: string; // ISO8601
  minutesEngaged: number; // t: 推し関連活動時間(分)
  moneySpentJpy: number; // m: 金額(JPY)
  emotionZScore: number; // e: センサ側Zスコア済
};

export type DailyStats = {
  date: string; // YYYY-MM-DD
  timeMinutes: number;
  moneyJpy: number;
  emotionZ: number;
};

export type NormalizationParams = {
  meanTimeMinutes: number; // μ_t
  stdTimeMinutes: number; // σ_t (>0)
  meanMoneyJpy: number; // μ_m
  stdMoneyJpy: number; // σ_m (>0)
};

export type WeightParams = {
  alpha: number; // α
  beta: number; // β
  gamma: number; // γ
};

export type DecayParams = {
  halfLifeDays: number; // 例: 7
};

export type ScoreEd = {
  date: string;
  value: number;
  zTime: number;
  zMoney: number;
  zEmotion: number;
};

export type ScoreQfiPoint = {
  date: string;
  value: number;
};

export type Rank = "A" | "B" | "C" | "D" | "E";

export type RankBreakpoints = {
  // 上位から順: A > B > C > D > E
  a: number; // 分位またはスコア閾値
  b: number;
  c: number;
  d: number;
};

export type DevotionSignature = {
  edDate: string;
  edValue: number;
  signatureHex: string;
  signerAddress?: string;
};

export type ApiConfig = {
  baseUrl: string; // 可変ドメイン
};

export type EdRecordPayload = {
  ed: ScoreEd;
  signature: DevotionSignature;
};



