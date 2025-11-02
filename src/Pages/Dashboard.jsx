import {
  Package,
  AlertTriangle,
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getDashboardStats,
  mockProducts,
  mockSales,
  mockCustomerDebts,
  mockSupplierDebts,
  mockMonthlyData,
} from "@/data/mockData";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

function Dashboard() {
  const stats = getDashboardStats();

  const lowStockProducts = mockProducts.filter(
    (p) => p.stockLevel <= p.minStock
  );
  const recentSales = mockSales.slice(0, 5);
  const urgentDebts = [...mockCustomerDebts, ...mockSupplierDebts]
    .filter((debt) => debt.pendingAmount > 0)
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 3);

  return (
    <div className="space-y-6 m-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[hsl(216,32%,17%)]">
            Dashboard
          </h1>
          <p className="text-[hsl(216,20%,45%)] mt-1">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <Button
          className="bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))] text-white shadow-[0_10px_20px_-10px_hsl(214,100%,70%)] rounded-[10px] cursor-pointer"
          onClick={() => {
            const reportData = {
              totalProducts: stats.totalProducts,
              totalSales: stats.totalSales,
              monthlyProfit: stats.monthlyProfit,
              customerDebts: stats.pendingCustomerDebts,
              supplierDebts: stats.pendingSupplierDebts,
              employeeSalaries: stats.totalEmployeeSalaries,
              generatedAt: new Date().toISOString(),
            };
            const blob = new Blob([JSON.stringify(reportData, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `business-report-${new Date()
              .toISOString()
              .split("T")[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          Generate Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
        <StatsCard
          className="border-[hsl(214,20%,88%)] hover:shadow-medium p-0,5"
          title="Total Products"
          value={stats.totalProducts}
          icon={Package} 
          trend={{ value: 12, label: "from last month" }}
          variant="default"
        />
        <StatsCard 
          className="border-[hsl(214,20%,88%)] hover:shadow-medium p-0,5"
          title="Low Stock Alert"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          variant="warning"
        /> 
        <StatsCard
          className="border-[hsl(214,20%,88%)] hover:shadow-medium p-0,5s"
          title="Total Sales"
          value={`؋${stats.totalSales.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 18, label: "from last month" }}
          variant="success"
        />
        <StatsCard
          className="border-[hsl(214,20%,88%)] hover:shadow-medium p-0,5"
          title="Monthly Profit"
          value={`؋${stats.monthlyProfit.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: 14, label: "from last month" }}
          variant="success"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          className="border-[hsl(214,20%,88%)] hover:shadow-medium p-0,5"
          title="Customer Debts"
          value={`؋${stats.pendingCustomerDebts.toLocaleString()}`}
          icon={CreditCard}
          variant="destructive"
        />
        <StatsCard
          className="border-[hsl(214,20%,88%)] hover:shadow-medium p-0,5"
          title="Supplier Debts"
          value={`؋${stats.pendingSupplierDebts.toLocaleString()}`}
          icon={CreditCard}
          variant="destructive"
        />
        <StatsCard
          className="border-[hsl(214,20%,88%)] hover:shadow-medium p-0,5"
          title="Pending Salaries"
          value={`؋${stats.totalEmployeeSalaries.toLocaleString()}`}
          icon={Users}
          variant="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="gradient-card shadow-soft  border-[hsl(214,20%,88%)]">
          <CardHeader>
            <CardTitle className="text-[hsl(216,32%,17%)] text-2xl">
              Monthly Performance
            </CardTitle>
            <CardDescription className="text-[hsl(216,20%,45%)]">
              Sales, purchases, and profit trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockMonthlyData} className="  outline-none">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0,0%,100%)",
                    border: "1px solid ",
                    borderColor: "hsl(214,20%,88%)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(214,84%,56%)" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'hsl(0,0%,100%)' }}
                  activeDot={{ r: 6, fill: 'hsl(214,84%,56%)' }}
                />
                <Line
                  type="monotone"
                  dataKey="purchases"
                  stroke="hsl(38,92%,50%)" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'hsl(0,0%,100%)' }}
                  activeDot={{ r: 6, fill: 'hsl(38,92%,50%)' }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(142,76%,36%)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'hsl(0,0%,100%)' }}
                  activeDot={{ r: 6, fill: 'hsl(142,76%,36%)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="gradient-card shadow-soft border-[hsl(214,20%,88%)]">
          <CardHeader>
            <CardTitle className=" text-[hsl(216,32%,17%)] text-2xl">
              Monthly Comparison
            </CardTitle>
            <CardDescription className="text-[hsl(216,20%,45%)]">Revenue vs expenses breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0,0%,100%)",
                    border: "1px solid ",
                    borderColor: "hsl(214,20%,88%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sales" fill="hsl(214,84%,56%)" radius={[0,0,0,0]} />
                <Bar dataKey="purchases" fill="hsl(38,92%,50%)" radius={[0,0,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Low Stock Alert */}
        <Card className="gradient-card shadow-soft border-[hsl(214,20%,88%)]">
          <CardHeader>
            <CardTitle className="text-2xl text-[hsl(216,32%,17%)] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[hsl(35,96%,60%)]" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-[hsl(220,15%,35%)]">Products running low</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="flex items-center text-[hsl(216,32%,17%)] justify-between"
              >
                <div>
                  <p className="font-medium text-sm text-[hsl(216,32%,17%)] text-foreground">
                    {product.name}
                  </p>
                  <p className="text-xs text-[hsl(220,15%,35%)]">
                    SKU: {product.sku}
                  </p>
                </div>
                <Badge 
                  variant="secondary"
                  className="bg-[hsl(38,92%,55%)]/10 text-[hsl(35,96%,60%)] hover:bg-[hsl(210,20%,96%)] rounded-[40.75rem]"
                >
                  {product.stockLevel} left
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="gradient-card shadow-soft border-[hsl(214,20%,88%)]">
          <CardHeader>
            <CardTitle className="text-2xl text-[hsl(216,32%,17%)]">Recent Sales</CardTitle>
            <CardDescription className="text-[hsl(220,15%,35%)]">Latest transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSales.slice(0, 3).map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm text-[hsl(216,32%,17%)]">
                    {sale.customer}
                  </p>
                  <p className="text-xs text-[hsl(220,15%,35%)]">
                    {sale.items.map((item) => item.productName).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm text-[hsl(140,60%,40%)]">
                    ؋{sale.amountPaid.toLocaleString()}
                  </p>
                  {sale.pendingAmount > 0 && (
                    <p className="text-xs text-[hsl(0,84%,60%)]">
                      ؋{sale.pendingAmount.toLocaleString()} pending
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Urgent Debts */}
        <Card className="gradient-card shadow-soft border-[hsl(214,20%,88%)]">
          <CardHeader>
            <CardTitle className="text-2xl text-[hsl(216,32%,17%)] flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[hsl(0,84%,60%)]" />
              Urgent Collections
            </CardTitle>
            <CardDescription className="text-[hsl(220,15%,35%)]">Debts due soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentDebts.map((debt) => (
              <div
                key={debt.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm text-[hsl(216,32%,17%)]">
                    {"customerName" in debt
                      ? debt.customerName
                      : debt.supplierName}
                  </p>
                  <p className="text-xs text-[hsl(220,15%,35%)]">
                    Due: {debt.dueDate}
                  </p>
                </div>
                <Badge
                  variant="destructive"
                  className="bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,60%)] rounded-2xl hover:bg-[hsl(0,80%,60%,0.8)]"
                >
                  ؋{debt.pendingAmount.toLocaleString()}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default Dashboard;