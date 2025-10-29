"use client";

import { useState } from "react";
import { DailyStats } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFormProps {
  onSubmit: (data: DailyStats) => void;
  onReset?: () => void;
  defaultValues?: Partial<DailyStats>;
}

export function InputForm({ onSubmit, onReset, defaultValues }: InputFormProps) {
  const [timeMinutes, setTimeMinutes] = useState(defaultValues?.timeMinutes ?? 60);
  const [moneyJpy, setMoneyJpy] = useState(defaultValues?.moneyJpy ?? 1000);
  const [emotionZ, setEmotionZ] = useState(defaultValues?.emotionZ ?? 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    // バリデーション
    if (timeMinutes < 0) {
      newErrors.timeMinutes = "時間は0以上である必要があります";
    }
    if (moneyJpy < 0) {
      newErrors.moneyJpy = "金額は0以上である必要があります";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    // 日付は今日の日付を使用
    const today = new Date().toISOString().split("T")[0];
    
    onSubmit({
      date: today,
      timeMinutes,
      moneyJpy,
      emotionZ,
    });
  };

  const handleResetClick = () => {
    setTimeMinutes(60);
    setMoneyJpy(1000);
    setEmotionZ(0);
    setErrors({});
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeMinutes">時間（分）</Label>
          <Input
            id="timeMinutes"
            type="number"
            min="0"
            value={timeMinutes}
            onChange={(e) => {
              setTimeMinutes(Number(e.target.value));
              if (errors.timeMinutes) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.timeMinutes;
                  return next;
                });
              }
            }}
          />
          {errors.timeMinutes && (
            <p className="text-sm text-destructive">{errors.timeMinutes}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="moneyJpy">金額（JPY）</Label>
          <Input
            id="moneyJpy"
            type="number"
            min="0"
            value={moneyJpy}
            onChange={(e) => {
              setMoneyJpy(Number(e.target.value));
              if (errors.moneyJpy) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.moneyJpy;
                  return next;
                });
              }
            }}
          />
          {errors.moneyJpy && (
            <p className="text-sm text-destructive">{errors.moneyJpy}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emotionZ">感情Z</Label>
          <Input
            id="emotionZ"
            type="number"
            step="0.01"
            value={emotionZ}
            onChange={(e) => setEmotionZ(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">追加</Button>
        <Button type="button" variant="outline" onClick={handleResetClick}>
          リセット
        </Button>
      </div>
    </form>
  );
}

