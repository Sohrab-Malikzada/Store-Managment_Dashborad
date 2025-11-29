import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",         // قدیمی: success|warning|destructive|default
  stylePreset = null,          // جدید: "accentTitle", "iconLarge", ...
  className,
  // overrides برای هر بخش
  titleClassName = "",
  iconClassName = "",
  headerClassName = "",
  valueClassName = "",
  trendClassName = "",
}) {
  const formatValue = (val) => {
    if (typeof val === "number") {
      if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
      return val.toString();
    }
    return val;
  };

  // نگاشت presetها به کلاس‌ها (قابل گسترش)
  const presetMap = {
    accentTitle: {
      title: "text-[hsl(214,84%,56%)] font-semibold",
      iconWrap: "bg-[hsl(214,84%,56%)]/10 text-[hsl(214,84%,56%)]",
      value: "text-[hsl(216,32%,17%)]",
    },
    iconLarge: {
      iconWrap: "h-10 w-10 rounded-lg",
      icon: "h-6 w-6",
    },
    subtle: {
      title: "text-muted-foreground",
      iconWrap: "bg-muted/20 text-muted-foreground",
      value: "text-muted-foreground",
    },
  };

  const preset = stylePreset ? presetMap[stylePreset] || {} : {};

  return (
    <Card
      className={cn(
        "gradient-card shadow-[0,4px,30px] transition-all duration-300 border-[hsl(214,20%,88%)]",
        className
      )}
    >
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between space-y-0 pb-2",
          headerClassName
        )}
      >
        <CardTitle
          className={cn(
            "text-sm mt-[22px] ml-[-2px] font-medium text-[hsl(216,20%,45%)]",
            preset.title,
            titleClassName
          )}
        >
          {title}
        </CardTitle>

        <div
          className={cn(
            "h-8 w-8 rounded-[35%] mt-[22px] mr-[-2px] flex items-center justify-center",
            variant === "success" && "bg-[hsl(142,76%,36%)]/10 text-[hsl(144,100%,29%)]",
            variant === "warning" && "bg-[hsl(38,92%,55%)]/10 text-[hsl(35,96%,60%)]",
            variant === "destructive" && "bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,60%)]",
            variant === "default" && "bg-[hsl(211,100%,50%)]/10 text-[hsl(214,84%,56%)]",
            preset.iconWrap,
            iconClassName
          )}
        >
          {Icon ? <Icon className={cn("h-4 w-4", preset.icon, iconClassName)} /> : null}
        </div>
      </CardHeader>

      <CardContent className="mt-[-0px] ml-[-2px]">
        <div
          className={cn(
            "text-2xl font-bold -mt-6 text-[hsl(216,32%,17%)]",
            preset.value,
            valueClassName
          )}
        >
          {formatValue(value)}
        </div>

        {trend && (
          <p
            className={cn(
              "text-xs mt-1",
              trend.value > 0 ? "text-[hsl(142,76%,36%)]" : trend.value < 0 ? "text-destructive" : "text-muted-foreground",
              preset.trend,
              trendClassName
            )}
          >
            {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
