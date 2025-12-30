
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, Package, Users, ShoppingCart, Calendar } from "lucide-react";

const yearlyData = {
  2024: {
    monthly: [
      { month: "Jan", sales: 45000, purchases: 32000, profit: 13000 },
      { month: "Feb", sales: 52000, purchases: 38000, profit: 14000 },
      { month: "Mar", sales: 48000, purchases: 35000, profit: 13000 },
      { month: "Apr", sales: 61000, purchases: 42000, profit: 19000 },
      { month: "May", sales: 55000, purchases: 40000, profit: 15000 },
      { month: "Jun", sales: 67000, purchases: 45000, profit: 22000 },
      { month: "Jul", sales: 72000, purchases: 48000, profit: 24000 },
      { month: "Aug", sales: 69000, purchases: 46000, profit: 23000 },
      { month: "Sep", sales: 64000, purchases: 44000, profit: 20000 },
      { month: "Oct", sales: 71000, purchases: 47000, profit: 24000 },
      { month: "Nov", sales: 76000, purchases: 50000, profit: 26000 },
      { month: "Dec", sales: 82000, purchases: 52000, profit: 30000 },
    ],
    stats: {
      totalRevenue: "$762,000",
      netProfit: "$243,000",
      productsSold: "3,847",
      activeCustomers: "1,534",
      avgOrderValue: "$198"
    }
  },
  2023: {
    monthly: [
      { month: "Jan", sales: 38000, purchases: 28000, profit: 10000 },
      { month: "Feb", sales: 42000, purchases: 32000, profit: 10000 },
      { month: "Mar", sales: 39000, purchases: 30000, profit: 9000 },
      { month: "Apr", sales: 51000, purchases: 36000, profit: 15000 },
      { month: "May", sales: 47000, purchases: 34000, profit: 13000 },
      { month: "Jun", sales: 58000, purchases: 40000, profit: 18000 },
      { month: "Jul", sales: 62000, purchases: 42000, profit: 20000 },
      { month: "Aug", sales: 59000, purchases: 41000, profit: 18000 },
      { month: "Sep", sales: 54000, purchases: 38000, profit: 16000 },
      { month: "Oct", sales: 61000, purchases: 42000, profit: 19000 },
      { month: "Nov", sales: 66000, purchases: 44000, profit: 22000 },
      { month: "Dec", sales: 70000, purchases: 46000, profit: 24000 },
    ],
    stats: {
      totalRevenue: "$647,000",
      netProfit: "$194,000",
      productsSold: "3,241",
      activeCustomers: "1,289",
      avgOrderValue: "$179"
    }
  }
};

const categoryData = [
  { name: "Electronics", value: 35, color: "hsl(214.15deg 83.93% 56.08%)" },
  { name: "Clothing", value: 25, color: "hsl(141.86deg 76.09% 36.08%)" },
  { name: "Home & Garden", value: 20, color: "hsl(38.04deg 92.16% 50%)" },
  { name: "Sports", value: 12, color: "hsl(261.91deg 83.18% 58.04%)" },
  { name: "Books", value: 8, color: "hsl(345.94deg 76.8% 49.02%)" },
];

export default function Analytics() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const currentData = yearlyData[selectedYear];
  return (
    <div className="space-y-6 m-6">
      <div className="flex flex-col md:flex-row items-left justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">Analytics & Reports</h1>
          <p className="text-[hsl(216,20%,45%)]">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center mt-2 ml-auto space-x-3">
          <Calendar className="h-5 w-5 text-[hsl(216,20%,45%)]" />
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-20 sm:w-32 bg-[hsl(216,20%,98%)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={"bg-white"}>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid  gap-4 grid-cols-1 ">
        <StatsCard
          id="table-analytics2003"
          title="Total Revenue"
          value={currentData.stats.totalRevenue}
          icon={DollarSign}
          trend={{ value: selectedYear === "2024" ? 17.8 : 15.2, label: "from last year" }}
          trendchange="mt-[-6px] text-[hsl(142,76%,36%)] -mr-6 -ml-[16px] text-[hsl(142,76%,36%)] text-left text-[12px]"
          variant="warning"
          valuechange="mt-[18px]"
          box="h-[141px]"
          titlechange="mt-[-7px]"
          icanchange="-right-4 h-4 w-4"
          iconColor="bg-[hsl(38,92%,55%)]/10 text-[hsl(38,92%,50%)] rounded-[12px] p-2 h-8 w-8"
        />
        <StatsCard
          title="Net Profit"
          value={currentData.stats.netProfit}
          icon={TrendingUp}
          trend={{ value: selectedYear === "2024" ? 25.3 : 22.5, label: "from last year" }}
          trendchange="mt-[-6px] text-[hsl(142,76%,36%)] -mr-6 -ml-[16px] text-[hsl(142,76%,36%)] text-left text-[12px]"
          variant="warning"
          valuechange="mt-[18px]"
          box=" h-[141px]"
          titlechange="mt-[-7px]"
          icanchange="-right-4 h-4 w-4"
          iconColor="text-green-600 bg-green-100 rounded-[12px] p-2 h-8 w-8"
        />
        <StatsCard
          title="Products Sold"
          value={currentData.stats.productsSold}
          icon={Package}
          trend={{ value: selectedYear === "2024" ? 18.7 : 8.1, label: "this year" }}
          trendchange="mt-[-6px] text-[hsl(142,76%,36%)] -mr-6 -ml-[16px] text-[hsl(142,76%,36%)] text-left text-[12px]"
          variant="warning"
          valuechange="mt-[18px]"
          box=" h-[141px]"
          titlechange="mt-[-7px]"
          icanchange="-right-4 h-4 w-4"
          iconColor="text-blue-600 bg-blue-100 rounded-[12px] p-2 h-8 w-8"
        />
        <StatsCard
          title="Active Customers"
          value={currentData.stats.activeCustomers}
          icon={Users}
          trend={{ value: selectedYear === "2024" ? 19.0 : 12.3, label: "total" }}
          trendchange="mt-[-6px] text-[hsl(142,76%,36%)] -mr-6 -ml-[16px] text-[hsl(142,76%,36%)] text-left text-[12px]"
          variant="warning"
          valuechange="mt-[18px]"
          box=" h-[141px]"
          titlechange="mt-[-7px]"
          icanchange="-right-4 h-4 w-4"
          iconColor="text-purple-600 bg-purple-100 rounded-[12px] p-2 h-8 w-8"
        />
        <StatsCard
          title="Avg Order Value"
          value={currentData.stats.avgOrderValue}
          icon={ShoppingCart}
          trend={{ value: selectedYear === "2024" ? 10.6 : -2.4, label: "this year" }}
          trendchange="mt-[-6px]  -mr-6 -ml-[16px] text-left text-[12px]"
          variant="warning"
          valuechange="mt-[18px]"
          box=" h-[141px]"
          titlechange="mt-[-7px]"
          icanchange="-right-4 h-4 w-4"
          iconColor="text-blue-600 bg-blue-100 rounded-[12px] p-2 h-8 w-8"
        />
      </div>
     
      <div id="chart-analytics-2003" className="grid gap-6 grid-cols-1">
        <Card className="gradient-card rounded-[12px] shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center  gap-2">
              <TrendingUp className="h-5 w-5 text-[hsl(141.86deg,76.09%,36.08%)]" />
              Monthly Performance - {selectedYear}
            </CardTitle>
            <CardDescription className="-mt-[4px]">Sales, purchases, and profit comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div id="chart-analytics1">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentData.monthly}>
                  <defs>
                    <linearGradient id="bar-gradient-sales">
                      <stop stopColor="hsl(214.15deg 83.93% 56.08%)" />
                    </linearGradient>
                    <linearGradient id="bar-gradient-purchases">
                      <stop stopColor="hsl(141.86deg 76.09% 36.08%)" />
                    </linearGradient>
                    <linearGradient id="bar-gradient-profit">
                      <stop  stopColor="hsl(38.04deg 92.16% 50%)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-[hsl(214,20%,95%)]" />
                  <XAxis dataKey="month" className="text-[hsl(216,20%,45%)]" />
                  <YAxis  className="text-[hsl(216,20%,45%)]" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(0deg 0% 99.22%)",
                      border: "1px solid hsl(214,20%,88%)",
                      borderRadius: "10px",
                    }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Bar dataKey="sales" fill="hsl(214.15deg 83.93% 56.08%)" name="Sales" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="purchases" fill="hsl(141.86deg 76.09% 36.08%)" name="Purchases" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="profit" fill="hsl(38.04deg 92.16% 50%)" name="Profit" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[hsl(214.15deg,83.93%,56.08%)]" />
              Sales by Category
            </CardTitle>
            <CardDescription className="-mt-[4px]">Product category distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div id="SalesbyCategory">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    <radialGradient id="pie-gradient-1">
                      <stop stopColor="hsl(214.15deg 83.93% 56.08%)" />
                    </radialGradient>
                    <radialGradient id="pie-gradient-2">
                      <stop stopColor="hsl(141.86deg 76.09% 36.08%)" />
                    </radialGradient>
                    <radialGradient id="pie-gradient-3">
                      <stop stopColor="hsl(38.04deg 92.16% 50%)" />
                    </radialGradient>
                    <radialGradient id="pie-gradient-4">
                      <stop stopColor="hsl(261.91deg 83.18% 58.04%)" />
                    </radialGradient>
                    <radialGradient id="pie-gradient-5">
                      <stop stopColor="hsl(345.94deg 76.8% 49.02%)" />
                    </radialGradient>
                  </defs>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(0deg 0% 99.22%)",
                      border: "1px solid hsl(214,20%,88%)",
                      borderRadius: "10px",
                    }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-[hsl(216,20%,45%)]">{item.name}</span>
                    </div>
                    <span className="text-sm text-[hsl(216,32%,17%)] font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 h-106 rounded-[12px]  gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center -mb-1 mt-[-4px] gap-2">
              <DollarSign className="h-5 w-5 text-[hsl(214,84%,56%)]" />
              Profit Trend - {selectedYear}
            </CardTitle>
            <CardDescription>Monthly profit analysis over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData.monthly}>
                <defs>
                  <linearGradient id="line-gradient">
                    <stop stopColor="hsl(214.15deg 83.93% 56.08%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-[hsl(214,20%,95%)]" />
                <XAxis dataKey="month" className="text-[hsl(216,20%,45%)]" />
                <YAxis className="text-[hsl(216,20%,45%)]" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0deg 0% 99.22%)",
                    border: "1px solid hsl(214,20%,88%)",
                    borderRadius: "10px",
                  }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(214,84%,56%)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(214,84%,56%)", stroke: "hsl(214,84%,56%)", strokeWidth: 2, r: 6, }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}