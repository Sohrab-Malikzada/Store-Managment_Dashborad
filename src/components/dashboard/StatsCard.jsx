


import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatsCard({trendchange, icanchange, box, title, value, icon: Icon, trend, iconColor }) {
 
  let colorClass = iconColor;
  if (!colorClass) {
    if (title.toLowerCase().includes("purchase")) colorClass = "text-blue-600 bg-blue-100";
    else if (title.toLowerCase().includes("pending")) colorClass = "text-yellow-600 bg-yellow-100";
    else if (title.toLowerCase().includes("total employees")) colorClass = "text-blue-600 bg-blue-100";
    else if (title.toLowerCase().includes("monthly payroll")) colorClass = "text-green-600 bg-green-100";
    else if (title.toLowerCase().includes("advances given")) colorClass = "text-red-600 bg-red-100";
    else if (title.toLowerCase().includes("pending requests")) colorClass = "text-red-600 bg-red-100";
    else if (title.toLowerCase().includes("supplier")) colorClass = "text-green-600 bg-green-100";
    else if (title.toLowerCase().includes("order")) colorClass = "text-purple-600 bg-purple-100";
    else if (title.toLowerCase().includes("profit")) colorClass = "text-emerald-600 bg-emerald-100";
    else if (title.toLowerCase().includes("revenue")) colorClass = "text-pink-600 bg-pink-100";
    else colorClass = "text-primary bg-primary/10";
  }

  return (
    <Card className={`gradient-card ${box} shadow-[0,4px,30px]	 hover:shadow-[hsl(45,8%,69%)] transition-all duration-300 p-10 border-[hsl(214,20%,88%)] hover:shadow-medium `}>
      <div className="position-relative  flex -mb-3 items-right gap-10">
        {Icon && (
          <span className={`rounded-lg p-2  flex items-right  justify-end`}>
            <Icon className={`items-center ${icanchange}  ${colorClass} position-absolute -m-66 -mt-6 -mr-0  h-4 w-4 flex justify-end `} />
          </span>
        )}
        <div className=" flex-1">
          <div className="flex  justify-start -ml-18 -mt-2  tracking-tight items-center text-sm font-medium text-[hsl(216,20%,45%)]  leading-none">
            {title}
          </div>
          <div className="mt-4 -ml-18 space-x-7 flex justify-start text-2xl font-bold text-foreground leading-tight">
            <span className="self-end">{value}</span>
          </div>
        </div>
      </div>
      {trend && (
        <div className={`flex ${trendchange} items-center gap-1 text-xs font-semibold mt-2 ${trend.value > 0 ? 'text-emerald-600' : trend.value < 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
          {trend.value > 0 ? <ArrowUpRight className="w-4 h-4" /> : trend.value < 0 ? <ArrowDownRight className="w-4 h-4" /> : null}
          {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
        </div>
      )}
    </Card>
  );
}
