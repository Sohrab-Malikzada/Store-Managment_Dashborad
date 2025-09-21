import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsCard({ 
  title, 
  value, 
  icon: Icon,
  trend, 
  variant = "default",
  className 
}) {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000) {
        return `$${(val / 1000).toFixed(1)}k`;
      }
      return val.toString();
    }
    return val;
  };

  return (
    <Card 
      className={cn(
        "gradient-card shadow-soft hover:shadow-medium transition-all duration-300",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center",
          variant === "success" && "bg-success/10 text-success",
          variant === "warning" && "bg-warning/10 text-warning", 
          variant === "destructive" && "bg-destructive/10 text-destructive",
          variant === "default" && "bg-primary/10 text-primary"
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {formatValue(value)}
        </div>
        {trend && (
          <p className={cn(
            "text-xs mt-1",
            trend.value > 0 ? "text-success" : trend.value < 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
