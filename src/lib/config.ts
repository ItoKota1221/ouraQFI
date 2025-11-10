export const appConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8787",
  qfi: {
    halfLifeDays: Number(process.env.NEXT_PUBLIC_QFI_HALFLIFE_DAYS ?? 7),
    alpha: Number(process.env.NEXT_PUBLIC_QFI_WEIGHTS_ALPHA ?? 1),
    beta: Number(process.env.NEXT_PUBLIC_QFI_WEIGHTS_BETA ?? 2),
    gamma: Number(process.env.NEXT_PUBLIC_QFI_WEIGHTS_GAMMA ?? 1),
  },
};



