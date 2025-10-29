"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

export function SettingsDialog() {
  const { norm, weights, decay, ranks, setParams } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  // ローカルステート
  const [muTime, setMuTime] = useState(norm.muTime);
  const [sigmaTime, setSigmaTime] = useState(norm.sigmaTime);
  const [muMoney, setMuMoney] = useState(norm.muMoney);
  const [sigmaMoney, setSigmaMoney] = useState(norm.sigmaMoney);

  const [alpha, setAlpha] = useState(weights.alpha);
  const [beta, setBeta] = useState(weights.beta);
  const [gamma, setGamma] = useState(weights.gamma);

  const [halfLifeDays, setHalfLifeDays] = useState(decay.halfLifeDays);

  const [rankA, setRankA] = useState(ranks.A);
  const [rankB, setRankB] = useState(ranks.B);
  const [rankC, setRankC] = useState(ranks.C);
  const [rankD, setRankD] = useState(ranks.D);

  const handleSave = () => {
    setParams({
      norm: { muTime, sigmaTime, muMoney, sigmaMoney },
      weights: { alpha, beta, gamma },
      decay: { halfLifeDays },
      ranks: { A: rankA, B: rankB, C: rankC, D: rankD },
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    // 元の値に戻す
    setMuTime(norm.muTime);
    setSigmaTime(norm.sigmaTime);
    setMuMoney(norm.muMoney);
    setSigmaMoney(norm.sigmaMoney);
    setAlpha(weights.alpha);
    setBeta(weights.beta);
    setGamma(weights.gamma);
    setHalfLifeDays(decay.halfLifeDays);
    setRankA(ranks.A);
    setRankB(ranks.B);
    setRankC(ranks.C);
    setRankD(ranks.D);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="設定">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>パラメータ設定</DialogTitle>
          <DialogDescription>
            QFIの計算パラメータを調整できます。変更後は自動的に再計算されます。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 正規化パラメータ */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">正規化パラメータ</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="muTime">μ 時間（分）</Label>
                <Input
                  id="muTime"
                  type="number"
                  value={muTime}
                  onChange={(e) => setMuTime(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sigmaTime">σ 時間（分）</Label>
                <Input
                  id="sigmaTime"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={sigmaTime}
                  onChange={(e) => setSigmaTime(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="muMoney">μ 金額（JPY）</Label>
                <Input
                  id="muMoney"
                  type="number"
                  value={muMoney}
                  onChange={(e) => setMuMoney(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sigmaMoney">σ 金額（JPY）</Label>
                <Input
                  id="sigmaMoney"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={sigmaMoney}
                  onChange={(e) => setSigmaMoney(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* 重みパラメータ */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">重みパラメータ</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alpha">α（時間）</Label>
                <Input
                  id="alpha"
                  type="number"
                  step="0.1"
                  value={alpha}
                  onChange={(e) => setAlpha(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beta">β（金額）</Label>
                <Input
                  id="beta"
                  type="number"
                  step="0.1"
                  value={beta}
                  onChange={(e) => setBeta(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gamma">γ（感情）</Label>
                <Input
                  id="gamma"
                  type="number"
                  step="0.1"
                  value={gamma}
                  onChange={(e) => setGamma(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* 減衰パラメータ */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">減衰パラメータ</h3>
            <div className="space-y-2">
              <Label htmlFor="halfLifeDays">半減期（日）</Label>
              <Input
                id="halfLifeDays"
                type="number"
                min="1"
                value={halfLifeDays}
                onChange={(e) => setHalfLifeDays(Number(e.target.value))}
              />
            </div>
          </div>

          {/* ランク閾値 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">ランク閾値</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rankA">A ランク</Label>
                <Input
                  id="rankA"
                  type="number"
                  step="0.1"
                  value={rankA}
                  onChange={(e) => setRankA(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rankB">B ランク</Label>
                <Input
                  id="rankB"
                  type="number"
                  step="0.1"
                  value={rankB}
                  onChange={(e) => setRankB(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rankC">C ランク</Label>
                <Input
                  id="rankC"
                  type="number"
                  step="0.1"
                  value={rankC}
                  onChange={(e) => setRankC(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rankD">D ランク</Label>
                <Input
                  id="rankD"
                  type="number"
                  step="0.1"
                  value={rankD}
                  onChange={(e) => setRankD(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

