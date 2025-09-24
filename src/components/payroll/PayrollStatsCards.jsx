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
    <div className="grid gap-4 md:grid-cols-4">
      <StatsCard
        title="Total Paid This Month"
        value={`؋${totalPaidThisMonth.toLocaleString()}`}
        icon={DollarSign}
        trend={{ value: 8.2, label: "from last month" }}
        className="gradient-card shadow-soft hover:shadow-medium transition-smooth"
      />
      <StatsCard
        title="Employees Paid"
        value={employeesPaid.toString()}
        icon={Users}
        trend={{ value: 100, label: "completion rate" }}
        className="gradient-card shadow-soft hover:shadow-medium transition-smooth"
      />
      <StatsCard
        title="Total Bonuses"
        value={`؋${totalBonusPaid.toLocaleString()}`}
        icon={Award}
        trend={{ value: 25.3, label: "this period" }}
        className="gradient-card shadow-soft hover:shadow-medium transition-smooth"
      />
      <StatsCard
        title="Pending Payments"
        value={pendingPayments.toString()}
        icon={Calendar}
        trend={{ value: -12.5, label: "processing" }}
        className="gradient-card shadow-soft hover:shadow-medium transition-smooth"
      />
    </div>
  );
}
