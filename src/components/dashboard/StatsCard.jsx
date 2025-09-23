


import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatsCard({ title, value, icon: Icon, trend, iconColor }) {
 
  let colorClass = iconColor;
  if (!colorClass) {
    if (title.toLowerCase().includes("purchase")) colorClass = "text-blue-500 bg-blue-100";
    else if (title.toLowerCase().includes("pending")) colorClass = "text-yellow-600 bg-yellow-100";
    else if (title.toLowerCase().includes("supplier")) colorClass = "text-green-600 bg-green-100";
    else if (title.toLowerCase().includes("order")) colorClass = "text-purple-600 bg-purple-100";
    else if (title.toLowerCase().includes("profit")) colorClass = "text-emerald-600 bg-emerald-100";
    else if (title.toLowerCase().includes("revenue")) colorClass = "text-pink-600 bg-pink-100";
    else colorClass = "text-primary bg-primary/10";
  }

  return (
    <Card className="flex flex-col gap-2 p-4 bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className={`rounded-lg p-2 ${colorClass} flex items-center justify-center`}>
            <Icon className="h-6 w-6" />
          </span>
        )}
        <div className="flex-1">
          <div className="text-xs text-muted-foreground font-semibold mb-1 tracking-wide uppercase">{title}</div>
          <div className="text-xl font-bold text-foreground leading-tight">{value}</div>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold mt-2 ${trend.value > 0 ? 'text-emerald-600' : trend.value < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
          {trend.value > 0 ? <ArrowUpRight className="w-4 h-4" /> : trend.value < 0 ? <ArrowDownRight className="w-4 h-4" /> : null}
          {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
        </div>
      )}
    </Card>
  );
}
