"use client";

import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useEffect, useState } from "react";

export function QfiScoreDisplay() {
  const { qfi, ranks } = useAppStore();
  const [prevScore, setPrevScore] = useState<number | null>(null);
  
  // 最新のQFI値を取得
  const latestQfi = qfi.at(-1)?.qfi ?? 0;
  const previousQfi = qfi.length >= 2 ? qfi[qfi.length - 2].qfi : null;
  
  // QFIを0-100にスケーリング
  // Eランク（D閾値未満）を0、Aランク閾値を100とする
  const minScore = 0; // Eランクの下限
  const maxScore = ranks.A; // Aランクの閾値を100として扱う
  
  const normalizedScore = Math.min(100, Math.max(0, ((latestQfi - minScore) / (maxScore - minScore)) * 100));
  const displayScore = Math.round(normalizedScore);
  
  // 前回のスコアも計算
  const prevNormalizedScore = previousQfi !== null 
    ? Math.min(100, Math.max(0, ((previousQfi - minScore) / (maxScore - minScore)) * 100))
    : null;
  const prevDisplayScore = prevNormalizedScore !== null ? Math.round(prevNormalizedScore) : null;
  
  // 変化量を計算
  const scoreDelta = prevDisplayScore !== null ? displayScore - prevDisplayScore : null;
  
  // スコアが更新されたらアニメーション用の前回値を更新
  useEffect(() => {
    if (displayScore !== prevScore) {
      setPrevScore(displayScore);
    }
  }, [displayScore, prevScore]);
  
  // スコアに応じた色を決定
  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    if (score >= 30) return "text-orange-500";
    return "text-red-500";
  };
  
  // スコアに応じた背景グラデーション
  const getGradientColor = (score: number): string => {
    if (score >= 90) return "from-green-500/10 to-green-500/5";
    if (score >= 70) return "from-blue-500/10 to-blue-500/5";
    if (score >= 50) return "from-yellow-500/10 to-yellow-500/5";
    if (score >= 30) return "from-orange-500/10 to-orange-500/5";
    return "from-red-500/10 to-red-500/5";
  };

  return (
    <Card className={cn(
      "transition-all duration-500 hover:shadow-lg",
      "bg-linear-to-br",
      getGradientColor(displayScore)
    )}>
      <div className="p-6 text-center space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          現在のQFIスコア
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <div className={cn(
            "text-6xl font-bold tabular-nums transition-all duration-500",
            getScoreColor(displayScore)
          )}>
            {displayScore}
          </div>
          
          {/* 変化量の表示 */}
          {scoreDelta !== null && scoreDelta !== 0 && (
            <div className={cn(
              "flex items-center gap-1 text-lg font-semibold",
              scoreDelta > 0 ? "text-green-500" : "text-red-500"
            )}>
              {scoreDelta > 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <span>{Math.abs(scoreDelta)}</span>
            </div>
          )}
          
          {scoreDelta === 0 && prevDisplayScore !== null && (
            <div className="flex items-center gap-1 text-lg font-semibold text-muted-foreground">
              <Minus className="h-5 w-5" />
            </div>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          / 100
        </div>
        
        {/* プログレスバー */}
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden mt-4">
          <div
            className={cn(
              "h-3 rounded-full transition-all duration-1000 ease-out",
              displayScore >= 90 ? "bg-green-500" :
              displayScore >= 70 ? "bg-blue-500" :
              displayScore >= 50 ? "bg-yellow-500" :
              displayScore >= 30 ? "bg-orange-500" :
              "bg-red-500"
            )}
            style={{ width: `${displayScore}%` }}
          />
        </div>
        
        {/* 実際のQFI値（小さく表示） */}
        <div className="text-xs text-muted-foreground pt-2">
          生値: {latestQfi.toFixed(2)}
          {previousQfi !== null && (
            <span className={cn(
              "ml-2",
              latestQfi > previousQfi ? "text-green-500" : 
              latestQfi < previousQfi ? "text-red-500" : 
              "text-muted-foreground"
            )}>
              ({latestQfi > previousQfi ? "+" : ""}{(latestQfi - previousQfi).toFixed(2)})
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

