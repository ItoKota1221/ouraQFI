"use client";

import { DailyStats, ScoreEd, ScoreQfiPoint } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DataTableProps {
  data: DailyStats[];
  eds: ScoreEd[];
  qfi: ScoreQfiPoint[];
}

export function DataTable({ data, eds, qfi }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // データを結合して日付でソート
  const combined = data.map((d) => {
    const ed = eds.find((e) => e.date === d.date);
    const q = qfi.find((q) => q.date === d.date);
    return {
      ...d,
      ed: ed?.ed ?? 0,
      qfi: q?.qfi ?? 0,
    };
  }).sort((a, b) => b.date.localeCompare(a.date)); // 降順（最新が上）

  // ページネーション
  const totalPages = Math.ceil(combined.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentData = combined.slice(startIdx, endIdx);

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        データがありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日付</TableHead>
            <TableHead className="text-right">時間（分）</TableHead>
            <TableHead className="text-right">金額（JPY）</TableHead>
            <TableHead className="text-right">感情Z</TableHead>
            <TableHead className="text-right">Ed</TableHead>
            <TableHead className="text-right">QFI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((row, idx) => (
            <TableRow key={`${row.date}-${idx}`}>
              <TableCell className="font-medium">{row.date}</TableCell>
              <TableCell className="text-right">{row.timeMinutes}</TableCell>
              <TableCell className="text-right">{row.moneyJpy.toLocaleString()}</TableCell>
              <TableCell className="text-right">{row.emotionZ.toFixed(2)}</TableCell>
              <TableCell className="text-right">{row.ed.toFixed(2)}</TableCell>
              <TableCell className="text-right">{row.qfi.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            前へ
          </Button>
          <span className="text-sm text-muted-foreground">
            ページ {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            次へ
          </Button>
        </div>
      )}
    </div>
  );
}

