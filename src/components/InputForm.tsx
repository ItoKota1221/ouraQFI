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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    // バリデーション
    if (timeMinutes < 0) {
      newErrors.timeMinutes = "時間は0以上である必要があります";
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
      moneyJpy: 0, // 金額は常に0に固定
      emotionZ: 0, // 感情Zは常に0に固定
    });
  };

  const handleResetClick = () => {
    setTimeMinutes(60);
    setErrors({});
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex gap-2">
        <Button type="submit">追加</Button>
        <Button type="button" variant="outline" onClick={handleResetClick}>
          リセット
        </Button>
      </div>
    </form>
  );
}

