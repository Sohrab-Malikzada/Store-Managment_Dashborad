import { StatsCard } from "@/components/dashboard/StatsCard";
import { DollarSign, Users, Award, Calendar } from "lucide-react";

export function PayrollStatsCards({ payrollRecords, selectedPeriod }) {
  // Calculate payroll stats
  const totalPaidThisMonth = payrollRecords
    .filter(record => record.paymentDate.startsWith(selectedPeriod) && record.status === "paid")
    .reduce((sum, record) => sum + record.netPay, 0);
  
  const totalBonusPaid = payrollRecords
    .filter(record => record.paymentDate.startsWith(selectedPeriod) && record.status === "paid")
    .reduce((sum, record) => sum + record.bonus, 0);

  const pendingPayments = payrollRecords.filter(record => record.status === "pending").length;
  const employeesPaid = payrollRecords.filter(r => r.status === "paid").length;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatsCard
        title="Total Paid This Month"
        value={`؋${totalPaidThisMonth.toLocaleString()}`}
        icon={DollarSign}
        trend={{ value: 8.2, label: "from last month" }}
        trendchange="text-[hsl(142,76%,36%)]  -ml-4 mt-[-5px] "
        box={`rounded-[10px] h-35  text-red-600 border bg-red-600 text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
        icanchange="h-8 w-8 mb-2 p-2  -right-5 rounded-[12px] "
      />
      <StatsCard
        title="Employees Paid"
        value={employeesPaid.toString()}
        icon={Users}
        trend={{ value: 100, label: "completion rate" }}
        trendchange="text-[hsl(142,76%,36%)]  -ml-4 mt-[-5px] "
        box={`rounded-[10px] h-35  text-red-600 border bg-red-600 text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
        icanchange="h-8 w-8 mb-2 p-2  -right-5 rounded-[12px] "
      />
      <StatsCard
        title="Total Bonuses"
        value={`؋${totalBonusPaid.toLocaleString()}`}
        icon={Award}
        trend={{ value: 25.3, label: "this period" }}
        trendchange="text-[hsl(142,76%,36%)]  -ml-4 mt-[-5px] "
        box={`rounded-[10px] h-35  text-red-600 border bg-red-600 text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
        icanchange="h-8 w-8 mb-2 p-2  -right-5 rounded-[12px] "
      />
      <StatsCard
        title="Pending Payments"
        value={pendingPayments.toString()}
        icon={Calendar}
        trend={{ value: -12.5, label: "processing" }}
        trendchange="text-[hsl(0,84%,60%)]  -ml-4 mt-[-5px] "
        box={`rounded-[10px] h-35  text-red-600 border bg-red-600 text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
        icanchange="h-8 w-8 mb-2 p-2  -right-5 rounded-[12px] "
      />
    </div>
  );
}
