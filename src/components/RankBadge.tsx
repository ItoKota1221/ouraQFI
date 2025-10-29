"use client";

import { Rank } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RankBadgeProps {
  rank: Rank;
}

const rankColors: Record<Rank, string> = {
  A: "text-green-500 border-green-500",
  B: "text-blue-500 border-blue-500",
  C: "text-yellow-500 border-yellow-500",
  D: "text-orange-500 border-orange-500",
  E: "text-red-500 border-red-500",
};

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xl px-4 py-2 font-semibold transition-all duration-300",
        rankColors[rank]
      )}
    >
      {rank}
    </Badge>
  );
}

