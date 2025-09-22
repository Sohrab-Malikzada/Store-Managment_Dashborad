
import { Card } from "@/components/ui/card";

export function StatsCard({ title, value, icon: Icon, trend, iconColor }) {
  // تعیین رنگ آیکون بر اساس props یا عنوان
  let colorClass = iconColor;
  if (!colorClass) {
    if (title.toLowerCase().includes("purchase")) colorClass = "text-blue-500 bg-blue-100";
    else if (title.toLowerCase().includes("pending")) colorClass = "text-yellow-600 bg-yellow-100";
    else if (title.toLowerCase().includes("supplier")) colorClass = "text-green-600 bg-green-100";
    else if (title.toLowerCase().includes("order")) colorClass = "text-purple-600 bg-purple-100";
    else colorClass = "text-primary bg-primary/10";
  }

  return (
    <Card className="flex flex-col gap-2 p-5 bg-white border border-border rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200">
      <div className="flex items-center gap-4">
        {Icon && (
          <span className={`rounded-full p-2 ${colorClass} flex items-center justify-center`}>
            <Icon className="h-7 w-7" />
          </span>
        )}
        <div>
          <div className="text-sm text-muted-foreground font-medium mb-1">{title}</div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
      </div>
      {trend && (
        <div className="text-xs text-muted-foreground mt-2">
          {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
        </div>
      )}
    </Card>
  );
}
