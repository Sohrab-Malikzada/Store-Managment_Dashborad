import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
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
import { Toaster, toast } from "sonner";

function Dashboard() {
  const stats = getDashboardStats();
  const reportRef = useRef(null);

  // state برای منوی Generate Report
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  // بستن منو وقتی کلیک بیرون انجام شود
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setReportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const downloadReportAsPng = async () => {
    setReportMenuOpen(false);
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `business-report-${new Date().toISOString().split("T")[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Report downloaded as PNG");
    } catch (err) {
      console.error("Failed to generate PNG:", err);
      toast.error("خطا در تولید تصویر گزارش");
    }
  };

  const printReport = async () => {
    setReportMenuOpen(false);
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const dataUrl = canvas.toDataURL("image/png");

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Unable to open print window");
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              html, body { height: 100%; margin: 0; padding: 0; background: #fff; }
              .report-container { padding: 20px; box-sizing: border-box; width: 100%; }
              img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div class="report-container">
              <img src="${dataUrl}" alt="Report" />
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() { window.print(); }, 300);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error("Failed to print report:", err);
      toast.error("خطا در آماده‌سازی چاپ");
    }
  };

  const exportReportJson = () => {
    setReportMenuOpen(false);
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
    a.download = `business-report-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report exported (JSON)");
  };

  return (
    <div className="space-y-6 m-6">
      <Toaster />

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

        {/* Generate Report button + dropdown menu */}
        <div className="relative" ref={menuRef}>
          <Button
            onClick={() => setReportMenuOpen((s) => !s)}
            className="bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))] shadow-[0_10px_20px_-10px_hsl(214,100%,70%)] text-white rounded-[10px] cursor-pointer"
          >
            Generate Report
          </Button>

          {reportMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[hsl(214,20%,88%)] rounded shadow-md z-50">
              <button
                onClick={downloadReportAsPng}
                className="w-full text-left px-4 py-2 hover:bg-[hsl(214,20%,96%)]"
              >
                Download PNG
              </button>
              <button
                onClick={printReport}
                className="w-full text-left px-4 py-2 hover:bg-[hsl(214,20%,96%)]"
              >
                Print Report
              </button>
              <button
                onClick={exportReportJson}
                className="w-full text-left px-4 py-2 hover:bg-[hsl(214,20%,96%)]"
              >
                Export JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wrap the area to export/print */}
      <div ref={reportRef}>
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
          <StatsCard
            className="border-[hsl(214,20%,88%)] h-[142px] rounded-[12px] hover:shadow-medium p-0.5"
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            trend={{ value: 12, label: "from last month" }}
            variant="default"
          />
          <StatsCard
            className="border-[hsl(214,20%,88%)] rounded-[12px] hover:shadow-medium p-0.5"
            title="Low Stock Alert"
            value={stats.lowStockProducts}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatsCard
            className="border-[hsl(214,20%,88%)] rounded-[12px] hover:shadow-medium p-0.5"
            title="Total Sales"
            value={`؋${stats.totalSales.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: 18, label: "from last month" }}
            variant="success"
          />
          <StatsCard
            className="border-[hsl(214,20%,88%)] rounded-[12px] hover:shadow-medium p-0.5"
            title="Monthly Profit"
            value={`؋${stats.monthlyProfit.toLocaleString()}`}
            icon={TrendingUp}
            trend={{ value: 14, label: "from last month" }}
            variant="success"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-4 h-[122px] md:grid-cols-3 mt-6">
          <StatsCard
            className="border-[hsl(214,20%,88%)] rounded-[12px] hover:shadow-medium p-0.5"
            title="Customer Debts"
            value={`؋${stats.pendingCustomerDebts.toLocaleString()}`}
            icon={CreditCard}
            variant="destructive"
          />
          <StatsCard
            className="border-[hsl(214,20%,88%)] rounded-[12px] hover:shadow-medium p-0.5"
            title="Supplier Debts"
            value={`؋${stats.pendingSupplierDebts.toLocaleString()}`}
            icon={CreditCard}
            variant="destructive"
          />
          <StatsCard
            className="border-[hsl(214,20%,88%)] rounded-[12px] hover:shadow-medium p-0.5"
            title="Pending Salaries"
            value={`؋${stats.totalEmployeeSalaries.toLocaleString()}`}
            icon={Users}
            variant="warning"
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card className="gradient-card shadow-none rounded-[12px] border-[hsl(214,20%,88%)]">
            <CardHeader>
              <CardTitle className="text-[hsl(216,32%,17%)] text-2xl">
                Monthly Performance
              </CardTitle>
              <CardDescription className="text-[hsl(216,20%,45%)] mt-[-4px]">
                Sales, purchases, and profit trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockMonthlyData} className="outline-none">
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
                    dot={{ r: 3, fill: "hsl(0,0%,100%)" }}
                    activeDot={{ r: 4, fill: "hsl(214,84%,56%)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="purchases"
                    stroke="hsl(38,92%,50%)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "hsl(0,0%,100%)" }}
                    activeDot={{ r: 4, fill: "hsl(38,92%,50%)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(142,76%,36%)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "hsl(0,0%,100%)" }}
                    activeDot={{ r: 4, fill: "hsl(142,76%,36%)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-none rounded-[12px] border-[hsl(214,20%,88%)]">
            <CardHeader>
              <CardTitle className=" text-[hsl(216,32%,17%)] text-2xl">
                Monthly Comparison
              </CardTitle>
              <CardDescription className="text-[hsl(216,20%,45%)] mt-[-4px]">Revenue vs expenses breakdown</CardDescription>
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
                  <Bar dataKey="sales" fill="hsl(214,84%,56%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="purchases" fill="hsl(38,92%,50%)" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="grid gap-6 md:grid-cols-3 mt-6">
          {/* Low Stock Alert */}
          <Card className="gradient-card h-[256px] shadow-none rounded-[12px] border-[hsl(214,20%,88%)]">
            <CardHeader>
              <CardTitle className="text-2xl text-[hsl(216,32%,17%)] flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[hsl(35,96%,60%)]" />
                Low Stock Alert
              </CardTitle>
              <CardDescription className="text-[hsl(220,15%,35%)] mt-[-4px]">Products running low</CardDescription>
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
          <Card className="gradient-card h-[256px] rounded-[12px] shadow-none border-[hsl(214,20%,88%)]">
            <CardHeader>
              <CardTitle className="text-2xl text-[hsl(216,32%,17%)]">Recent Sales</CardTitle>
              <CardDescription className="text-[hsl(220,15%,35%)] mt-[-4px]">Latest transactions</CardDescription>
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
          <Card className="gradient-card h-[256px] rounded-[12px] shadow-none border-[hsl(214,20%,88%)]">
            <CardHeader>
              <CardTitle className="text-2xl text-[hsl(216,32%,17%)] flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[hsl(0,84%,60%)]" />
                Urgent Collections
              </CardTitle>
              <CardDescription className="text-[hsl(220,15%,35%)] mt-[-4px]">Debts due soon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {urgentDebts.map((debt) => (
                <div
                  key={debt.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-sm text-[hsl(216,32%,17%)]">
                      {"customerName" in debt ? debt.customerName : debt.supplierName}
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
    </div>
  );
}

export default Dashboard;
