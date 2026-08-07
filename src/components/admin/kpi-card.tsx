import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  trendPct: number | null;
  icon: LucideIcon;
}

export function KpiCard({ title, value, trendPct, icon: Icon }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trendPct !== null ? (
          <p
            className={cn(
              "flex items-center gap-1 text-xs mt-1",
              trendPct >= 0 ? "text-emerald-600" : "text-destructive"
            )}
          >
            {trendPct >= 0 ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {trendPct >= 0 ? "+" : ""}
            {trendPct}% desde ontem
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">Agora</p>
        )}
      </CardContent>
    </Card>
  );
}
