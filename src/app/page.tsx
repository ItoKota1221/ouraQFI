"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Home() {
  const { eds, qfi, latestRank, addDaily, reset } = useAppStore();
  const [form, setForm] = useState({ timeMinutes: 60, moneyJpy: 1000, emotionZ: 0 });

  return (
    <div className="min-h-screen p-6 sm:p-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quantified Faith Index</h1>
        <div className="text-lg">Rank: <span className="font-semibold">{latestRank ?? "-"}</span></div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-3">日次スコア（Ed）</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eds}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-3">累積スコア（QFI）</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qfi}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="font-semibold mb-3">入力（手動／スタブ）</h2>
        <form
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            addDaily({ ...form });
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm">時間（分）</span>
            <input
              type="number"
              className="border rounded px-2 py-1"
              value={form.timeMinutes}
              onChange={(e) => setForm((f) => ({ ...f, timeMinutes: Number(e.target.value) }))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">金額（JPY）</span>
            <input
              type="number"
              className="border rounded px-2 py-1"
              value={form.moneyJpy}
              onChange={(e) => setForm((f) => ({ ...f, moneyJpy: Number(e.target.value) }))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">感情Z</span>
            <input
              type="number"
              step="0.01"
              className="border rounded px-2 py-1"
              value={form.emotionZ}
              onChange={(e) => setForm((f) => ({ ...f, emotionZ: Number(e.target.value) }))}
            />
          </label>
          <div className="sm:col-span-3 flex gap-2">
            <button className="px-4 py-2 rounded bg-blue-600 text-white" type="submit">追加</button>
            <button className="px-4 py-2 rounded border" type="button" onClick={() => reset()}>リセット</button>
          </div>
        </form>
      </section>
    </div>
  );
}
