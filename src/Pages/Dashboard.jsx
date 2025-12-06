// File: DashboardWithReportBuilder.jsx
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Package,
  AlertTriangle,
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
  BoxIcon,
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
  mockEmployees,
  mockPurchases,
  mockSaleReturns,
  mockPurchaseReturns,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Toaster, toast } from "sonner";

function DashboardWithReportBuilder() {
  const stats = getDashboardStats();
  const reportRef = useRef(null);
  const menuRef = useRef(null);

  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedPages, setSelectedPages] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // derived data
  const lowStockProducts = mockProducts.filter((p) => p.stockLevel <= p.minStock);
  const recentSales = mockSales.slice(0, 5);
  const urgentDebts = [...mockCustomerDebts, ...mockSupplierDebts]
    .filter((d) => d.pendingAmount > 0)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // NOTE: include both analytics charts (monthly performance + monthly comparison)
  const availablePages = [
    { id: "dashboard_overview", title: "Dashboard Overview", type: "cards" },
    { id: "analytics", title: "Dashboard - Monthly Performance", type: "chart", chartId: "chart-analytics-monthly" },
    { id: "analytics_comparison", title: "Dashboard - Monthly Comparison", type: "chart", chartId: "chart-analytics-comparison" },
    { id: "inventory", title: "Inventory", type: "table", tableId: "table-inventory" },
    { id: "sales", title: "Sales", type: "table", tableId: "table-sales" },
    { id: "purchases", title: "Purchases", type: "table", tableId: "table-purchases" },
    { id: "returns", title: "Returns", type: "table", tableId: "table-returns" },
    { id: "debts", title: "Debts", type: "table", tableId: "table-debts" },
    { id: "employees", title: "Employees", type: "table", tableId: "table-employees" },
    { id: "payroll", title: "Payroll", type: "table", tableId: "table-payroll" },
    { id: "user_management", title: "User Management", type: "table", tableId: "table-users" },
    { id: "analytics2003", title: "Analytics", type: "chart", chartId: "SalesbyCategory" },
  ];

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setReportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePageSelection = (id) => {
    setSelectedPages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // collect structured data for each page (tables/cards)
  const collectDataForPage = (pageId) => {
    switch (pageId) {
      case "dashboard_overview":
        return {
          title: "Dashboard",
          type: "table",
          columns: ["Metric", "Value"],
          rows: [
            ["Total Products", stats.totalProducts],
            ["Low Stock Alert", stats.lowStockProducts],
            ["Total Sales", `؋${stats.totalSales.toLocaleString()}`],
            ["Monthly Profit", `؋${stats.monthlyProfit.toLocaleString()}`],
            ["Customer Debts", `؋${stats.pendingCustomerDebts.toLocaleString()}`],
            ["Supplier Debts", `؋${stats.pendingSupplierDebts.toLocaleString()}`],
            ["Pending Salaries", `؋${stats.totalEmployeeSalaries.toLocaleString()}`],
          ],
        };

      case "analytics":
        return {
          title: "Dashboard - Monthly Performance",
          type: "chart",
          chartId: "chart-analytics-monthly",
        };

      case "analytics_comparison":
        return {
          title: "Dashboard - Monthly Comparison",
          type: "chart",
          chartId: "chart-analytics-comparison",
        };

      case "inventory":
        return {
          title: "Inventory",
          type: "table",
          columns: ["Product", "SKU", "Category", "Stock", "Min Stock", "Sale Price"],
          rows: mockProducts.map((p) => [
            p.name,
            p.sku,
            p.category || "Uncategorized",
            p.stockLevel,
            p.minStock,
            `؋${Number(p.salePrice || 0).toLocaleString()}`,
          ]),
        };

      case "sales":
        return {
          title: "Sales",
          type: "table",
          columns: ["Sale ID", "Customer", "Items", "Total", "Paid", "Pending", "Date"],
          rows: mockSales.map((s) => [
            s.id,
            s.customer,
            s.items.map((it) => it.productName).join(", "),
            `؋${s.totalAmount.toLocaleString()}`,
            `؋${s.amountPaid.toLocaleString()}`,
            `؋${s.pendingAmount.toLocaleString()}`,
            s.saleDate || s.date || "",
          ]),
        };

      case "purchases":
        return {
          title: "Purchases",
          type: "table",
          columns: ["Purchase ID", "Supplier", "Product", "Qty", "Unit Price", "Total", "Pending", "Date"],
          rows: mockPurchases.map((p) => [
            p.id,
            p.supplier,
            p.productName,
            p.quantity,
            `؋${p.unitPrice.toLocaleString()}`,
            `؋${p.totalAmount.toLocaleString()}`,
            `؋${p.pendingAmount?.toLocaleString() || 0}`,
            p.purchaseDate || "",
          ]),
        };

      case "returns":
        return {
          title: "Returns",
          type: "table",
          columns: ["Return ID", "Type", "Original", "Party", "Amount", "Status", "Date"],
          rows: [
            ...mockSaleReturns.map((r) => ["SR" + r.id, "Sale", r.originalSaleId, r.customerName, `؋${r.totalAmount.toLocaleString()}`, r.status, r.returnDate]),
            ...mockPurchaseReturns.map((r) => ["PR" + r.id, "Purchase", r.originalPurchaseId, r.supplierName, `؋${r.totalAmount.toLocaleString()}`, r.status, r.returnDate]),
          ],
        };

      case "debts":
        return {
          title: "Debts",
          type: "table",
          columns: ["Name", "Type", "Total Debt", "Paid", "Pending", "Due Date"],
          rows: [
            ...mockCustomerDebts.map((d) => [d.customerName, "Customer", `؋${d.totalDebt?.toLocaleString()}`, `؋${d.paidAmount?.toLocaleString()}`, `؋${d.pendingAmount?.toLocaleString()}`, d.dueDate]),
            ...mockSupplierDebts.map((d) => [d.supplierName, "Supplier", `؋${d.totalDebt?.toLocaleString()}`, `؋${d.paidAmount?.toLocaleString()}`, `؋${d.pendingAmount?.toLocaleString()}`, d.dueDate]),
          ],
        };

      case "employees":
        return {
          title: "Employees",
          type: "table",
          columns: ["ID", "Name", "Position", "Monthly Salary", "Advance", "Pending Salary", "Join Date"],
          rows: mockEmployees.map((e) => [
            e.id,
            e.name,
            e.position,
            `؋${Number(e.monthlySalary || e.salary || 0).toLocaleString()}`,
            `؋${Number(e.advanceReceived || 0).toLocaleString()}`,
            `؋${Number(e.pendingSalary || 0).toLocaleString()}`,
            e.joinDate || "",
          ]),
        };

      case "payroll":
        return {
          title: "Payroll",
          type: "table",
          columns: ["Payroll ID", "Employee", "Base", "Bonus", "Deductions", "Net Pay", "Date", "Status"],
          rows: (function () {
            const payroll = (globalThis?.mockPayrollRecords) || [];
            if (payroll.length) {
              return payroll.map((r) => [r.id, r.employeeName, `؋${r.baseSalary}`, `؋${r.bonus}`, `؋${r.deductions}`, `؋${r.netPay}`, r.paymentDate, r.status]);
            }
            return mockEmployees.map((e, idx) => [`PR${idx + 1}`, e.name, `؋${e.salary}`, `؋0`, `؋0`, `؋${e.salary}`, new Date().toISOString().split("T")[0], "paid"]);
          })(),
        };


      case "analytics2003":
        return {
          title: "Analytics",
          type: "chart",
          chartId: "SalesbyCategory",
        };

      case "user_management":
        return {
          title: "User Management",
          type: "table",
          columns: ["Name", "Email", "Role", "Status", "Created"],
          rows: (function () {
            try {
              const raw = localStorage.getItem("app_users_v1");
              if (raw) {
                const users = JSON.parse(raw);
                return users.map((u) => [u.name, u.email, u.role, u.status, u.createdAt]);
              }
            } catch (e) {
              // ignore
            }
            return [["No users found", "-", "-", "-", "-"]];
          })(),
        };

      default:
        return { title: pageId, type: "table", columns: [], rows: [] };
    }
  };


  // generate PDF from selected pages
 // generate PDF from selected pages
const generatePdfFromSelection = async () => {
  const selectedIds = Object.keys(selectedPages).filter((k) => selectedPages[k]);
  if (selectedIds.length === 0) {
    toast.error("لطفاً حداقل یک صفحه را انتخاب کنید");
    return;
  }

  setIsGenerating(true);
  try {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    // Title page
    doc.setFontSize(20);
    doc.text("Business Report", margin, 70);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 90);
    doc.addPage();

    for (const id of selectedIds) {
      const data = collectDataForPage(id);

      // Cards -> render as simple two-column table
      if (data.type === "cards") {
        doc.setFontSize(14);
        doc.text(data.title, margin, 60);
        const rows = data.rows.map((r) => [String(r[0]), String(r[1])]);
        await autoTable(doc, {
          startY: 80,
          head: [["Metric", "Value"]],
          body: rows,
          margin: { left: margin, right: margin },
          styles: { fontSize: 10 },
          theme: "plain",
        });
        doc.addPage();
      }

      // Table -> use autotable
      else if (data.type === "table") {
        doc.setFontSize(14);
        doc.text(data.title, margin, 60);
        await autoTable(doc, {
          startY: 80,
          head: data.columns && data.columns.length ? [data.columns] : [],
          body: data.rows || [],
          margin: { left: margin, right: margin },
          styles: { fontSize: 10 },
          theme: "grid",
          headStyles: { fillColor: [0, 136, 204] },
        });
        doc.addPage();
      }

      // ✅ Chart -> capture DOM element by id and insert image (اصلاح‌شده)
      else if (data.type === "chart") {
        const chartEl = document.getElementById(data.chartId);
        doc.setFontSize(14);
        doc.text(data.title, margin, 60);

        if (chartEl) {
          // چارت رو به دید کاربر بیار و کمی صبر کن تا کامل رندر شود
          chartEl.scrollIntoView();
          await new Promise((resolve) => setTimeout(resolve, 500));

          const canvas = await html2canvas(chartEl, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          });
          const imgData = canvas.toDataURL("image/png");
          const imgProps = doc.getImageProperties(imgData);
          const imgWidth = pageWidth - margin * 2;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
          doc.addImage(imgData, "PNG", margin, 80, imgWidth, imgHeight);
          doc.addPage();
        } else {
          doc.text("(Chart not found in DOM)", margin, 80);
          doc.addPage();
        }
      }
    }

    doc.save(`business-report-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF generated");
  } catch (err) {
    console.error("PDF generation error:", err);
    toast.error("خطا در تولید PDF");
  } finally {
    setIsGenerating(false);
    setSelectorOpen(false);
    setReportMenuOpen(false);
  }
};


  // PNG download for full report (preserve original styles)
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

  // Print using a new window with the captured image (preserve styles visually)
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

  const SelectorModal = () => (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[12px] w-[760px] max-w-full p-6">
        <h3 className="text-xl font-semibold text-[hsl(216,32%,17%)] mb-4">Select pages to include in report</h3>
        <div className="grid grid-cols-2 gap-3 overflow-auto mb-4">
          {availablePages.map((p) => (
            <label key={p.id} className="bg-[hsl(248,250%,99%)] shadow-[0_2px_3px_-1px_hsl(0,0%,80%,0.5)] flex items-center gap-3 p-2 border border-[hsl(214,20%,88%)]  rounded hover:bg-[hsl(214,20%,97%)] cursor-pointer">
              {/* hidden native checkbox for accessibility */}
              {/* native checkbox with accent-color + simulated border via box-shadow */}
              <input
                type="checkbox"
                checked={!!selectedPages[p.id]}
                onChange={() => togglePageSelection(p.id)}
                className="w-5 h-5 cursor-pointer rounded-full focus:outline-none"
                style={{
                  // color of the check mark / filled background in modern browsers
                  accentColor: "hsl(200,100%,40%)",

                  // simulate a colored border that is visible across browsers
                  // when unchecked: light border; when checked: stronger colored ring
                  boxShadow: selectedPages[p.id]
                    ? "0 0 0 3px rgba(31,111,235,0.12), inset 0 0 0 2px hsl(200,100%,40%)"
                    : "inset 0 0 0 2px hsl(214,20%,88%)",

                  // keep background white so native check is visible
                  background: "white",
                  WebkitAppearance: "checkbox", // hint for webkit to keep native look
                  appearance: "checkbox",
                }}
              />
              <div>
                <div className="font-medium text-[hsl(216,32%,17%)]">{p.title}</div>
                <div className="text-xs text-[hsl(216,20%,45%)]">{p.type}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={() => setSelectorOpen(false)}
            className="border  shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(248,250%,96%)] border-[hsl(214,20%,88%)] hover:shadow-medium transition-smooth"
          >Cancel</Button>
          <Button onClick={generatePdfFromSelection} disabled={isGenerating} className="bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))] shadow-[0_10px_20px_-10px_hsl(214,100%,70%)] text-white rounded-[10px] cursor-pointer">
            {isGenerating ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>
    </div>
  );

  // Render: ensure both charts have explicit wrapper divs with IDs used by collectDataForPage
  return (
    <div className="space-y-6 m-6">
      <Toaster />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[hsl(216,32%,17%)]">Dashboard</h1>
          <p className="text-[hsl(216,20%,45%)] mt-1">Welcome back! Here's your business overview.</p>
        </div>

        {/* Generate Report */}
        <div className="relative" ref={menuRef}>
          <Button
            onClick={() => setReportMenuOpen((s) => !s)}
            className="bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))] shadow-[0_10px_20px_-10px_hsl(214,100%,70%)] text-white rounded-[10px] cursor-pointer"
          >
            Generate Report
          </Button>

          {reportMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 p-1 border-[hsl(214,20%,88%)] text-[hsl(216,32%,17%)] bg-white border rounded-[12px] shadow-md z-50">
              <button
                onClick={() => { setSelectorOpen(true); setReportMenuOpen(false); }}
                className="w-full text-left px-4 py-2 rounded-[10px] hover:bg-[hsl(214,20%,96%)]"
              >
                Build Report
              </button>
              <button
                onClick={downloadReportAsPng}
                className="w-full text-left px-4 py-2 rounded-[10px] hover:bg-[hsl(214,20%,96%)]"
              >
                Download PNG
              </button>
              <button
                onClick={printReport}
                className="w-full text-left px-4 py-2 rounded-[10px] hover:bg-[hsl(214,20%,96%)]"
              >
                Print
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content (kept similar to your original layout) */}
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
              {/* IMPORTANT: wrapper div has the ID used by PDF capture */}
              <div id="chart-analytics-monthly" style={{ width: "100%", height: 300 }}>
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
              </div>
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
              <div id="chart-analytics-comparison" style={{ width: "100%", height: 300 }}>
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Example tables with IDs so they can be captured or their data used */}
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
            <CardContent id="table-inventory" className="space-y-3">
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
            <CardContent id="table-sales" className="space-y-3">
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
            <CardContent id="table-debts" className="space-y-3">
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

      {selectorOpen && <SelectorModal />}
    </div>
  );
}

export default DashboardWithReportBuilder;
