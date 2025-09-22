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
    <div className="space-y-6 m-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <Button
          className="gradient-primary bg-blue-500 hover:bg-blue-600 text-white shadow-glow"
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={{ value: 12, label: "from last month" }}
          variant="default"
        />
        <StatsCard
          title="Low Stock Alert"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatsCard
          title="Total Sales"
          value={`؋${stats.totalSales.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 18, label: "from last month" }}
          variant="success"
        />
        <StatsCard
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
          title="Customer Debts"
          value={`؋${stats.pendingCustomerDebts.toLocaleString()}`}
          icon={CreditCard}
          variant="destructive"
        />
        <StatsCard
          title="Supplier Debts"
          value={`؋${stats.pendingSupplierDebts.toLocaleString()}`}
          icon={CreditCard}
          variant="destructive"
        />
        <StatsCard
          title="Pending Salaries"
          value={`؋${stats.totalEmployeeSalaries.toLocaleString()}`}
          icon={Users}
          variant="reductive"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="text-foreground">
              Monthly Performance
            </CardTitle>
            <CardDescription>
              Sales, purchases, and profit trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid gray",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#6366f1' }}
                  activeDot={{ r: 6, fill: '#6366f1' }}
                />
                <Line
                  type="monotone"
                  dataKey="purchases"
                  stroke="#f59e42" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#f59e42' }}
                  activeDot={{ r: 6, fill: '#f59e42' }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="text-foreground">
              Monthly Comparison
            </CardTitle>
            <CardDescription>Revenue vs expenses breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid gray",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sales" fill="#6366f1" radius={[4,4,0,0]} />
                <Bar dataKey="purchases" fill="#f59e42" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Low Stock Alert */}
        <Card className="gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Products running low</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    SKU: {product.sku}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-warning/10 text-warning"
                >
                  {product.stockLevel} left
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Sales</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSales.slice(0, 3).map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {sale.customer}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sale.items.map((item) => item.productName).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm text-green-500">
                    ؋{sale.amountPaid.toLocaleString()}
                  </p>
                  {sale.pendingAmount > 0 && (
                    <p className="text-xs text-destructive">
                      ؋{sale.pendingAmount.toLocaleString()} pending
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Urgent Debts */}
        <Card className="gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-destructive" />
              Urgent Collections
            </CardTitle>
            <CardDescription>Debts due soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentDebts.map((debt) => (
              <div
                key={debt.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {"customerName" in debt
                      ? debt.customerName
                      : debt.supplierName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Due: {debt.dueDate}
                  </p>
                </div>
                <Badge
                  variant="destructive"
                  className="bg-destructive/10 text-destructive"
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