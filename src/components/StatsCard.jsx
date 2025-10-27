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
        " gradient-card  shadow-[0,4px,30px]	 hover:shadow-[hsl(45,8%,69%)] transition-all duration-300",
        className
      )}
    >
      <CardHeader className="flex  flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm  font-medium text-[hsl(216,20%,45%)]">
          {title}
        </CardTitle>
        <div className={cn(
          "h-8 w-8 rounded-[35%] flex items-center justify-center",
          variant === "success" && "bg-[hsl(142,76%,36%)]/10 text-[hsl(144,100%,29%)]",
          variant === "warning" && "bg-[hsl(38,92%,55%)]/10 text-[hsl(35,96%,60%)]",  
          variant === "destructive" && "bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,60%)]",
          variant === "default" && "bg-[hsl(211,100%,50%))]/10 text-[hsl(214,84%,56%)]",
          variant === "title" && "bg-title/10 text-[hsl(216,32%,17%)]"

        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold -mt-6 text-foreground">
          {formatValue(value)}
        </div>
        {trend && (
          <p className={cn(
            "text-xs mt-1",
            trend.value > 0 ? "text-[hsl(142,76%,36%)]" : trend.value < 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
