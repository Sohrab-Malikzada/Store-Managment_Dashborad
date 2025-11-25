
import { useState } from "react";
import { CreditCard, Users, Truck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCustomerDebts, mockSupplierDebts } from "@/data/mockData";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DebtDetailsDialog } from "@/components/dialogs/DebtDetailsDialog";
import { Toaster } from "@/components/ui/sonner"

export default function Debts() {
  const [customerDebts, setCustomerDebts] = useState(mockCustomerDebts);
  const [supplierDebts, setSupplierDebts] = useState(mockSupplierDebts);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [dialogType, setDialogType] = useState('customer');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalCustomerDebt = customerDebts.reduce((sum, debt) => sum + debt.pendingAmount, 0);
  const totalSupplierDebt = supplierDebts.reduce((sum, debt) => sum + debt.pendingAmount, 0);
  const overdueCustomerDebts = customerDebts.filter(debt =>
    new Date(debt.dueDate) < new Date() && debt.pendingAmount > 0
  ).length;
  const overdueSupplierDebts = supplierDebts.filter(debt =>
    new Date(debt.dueDate) < new Date() && debt.pendingAmount > 0
  ).length;

  const getDebtStatus = (dueDate, pendingAmount) => {
    if (pendingAmount === 0) return { label: "Paid", variant: "success" };
    const due = new Date(dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue < 0) return { label: "Overdue", variant: "destructive" };
    if (daysUntilDue <= 7) return { label: "Due Soon", variant: "warning" };
    return { label: "Active", variant: "default" };
  };

  const handleViewDebt = (debt, type) => {
    setSelectedDebt(debt);
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const handlePaymentUpdate = (debtId, paymentAmount) => {
    if (dialogType === 'customer') {
      setCustomerDebts(prev => prev.map(debt =>
        debt.id === debtId
          ? {
            ...debt,
            paidAmount: debt.paidAmount + paymentAmount,
            pendingAmount: debt.pendingAmount - paymentAmount
          }
          : debt
      ));
    } else {
      setSupplierDebts(prev => prev.map(debt =>
        debt.id === debtId
          ? {
            ...debt,
            paidAmount: debt.paidAmount + paymentAmount,
            pendingAmount: debt.pendingAmount - paymentAmount
          }
          : debt
      ));
    }
  };

  return (
    <div className="space-y-6 m-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[hsl(216,32%,17%)]">Debt Management</h1>
          <p className="text-[hsl(216,20%,45%)] mt-1">
            Track customer and supplier payment obligations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid  gap-4 md:grid-cols-4">
        <StatsCard
          title="Customer Debts"
          value={`$${totalCustomerDebt.toFixed(2)}`}
          icon={Users}
          variant="warning"
          icanchange="items-center relative -m-66 -mt-6 -mr-44  h-4 w-4"
          iconColor="bg-[hsl(38,92%,55%)]/10 text-[hsl(38,92%,50%)] rounded-[12px] p-2 h-8 w-8"
        />
        <StatsCard
          title="Supplier Debts"
          value={`$${totalSupplierDebt.toFixed(2)}`}
          icon={Truck}
          variant="destructive"
          icanchange="items-center relative -m-66 -mt-6 -mr-44  h-4 w-4"
          iconColor="bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,60%)] rounded-[12px] p-2 h-8 w-8"

        />
        <StatsCard
          title="Overdue Customer"
          value={overdueCustomerDebts}
          icon={AlertCircle}
          variant="destructive"
          icanchange="items-center relative -m-66 -mt-6 -mr-44  h-4 w-4"
          iconColor="bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,60%)] rounded-[12px] p-2 h-8 w-8"
        />
        <StatsCard
          title="Overdue Supplier"
          value={overdueSupplierDebts}
          icon={AlertCircle}
          variant="destructive"
          icanchange="items-center relative -m-66 -mt-6 -mr-44  h-4 w-4"
          iconColor="bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,60%)] rounded-[12px] p-2 h-8 w-8"
        />
      </div>

      {/* Debts Tabs */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="mt-[1px] grid w-full grid-cols-2 bg-[hsl(210deg,20%,96.08%)]">
          <TabsTrigger value="customers">Customer Debts</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Debts</TabsTrigger>
        </TabsList>

        {/* Customer Debts */}
        <TabsContent value="customers">
          <Card className="mt-[-5px] gradient-card shadow-none">
            <CardHeader>
              <CardTitle className="text-[hsl(216,32%,17%)] flex items-center gap-2">
                <Users className="h-5 w-5 text-[hsl(38,92%,50%)]" />
                Customer Debts
              </CardTitle>
              <CardDescription className="mt-[-4px]">
                Money owed by customers for installment purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-[hsl(214,20%,88%)]  rounded-[12px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4 py-[14px]">Customer</TableHead>
                      <TableHead className="px-2 pr-6 pl-4 py-[14px]">Total Debt</TableHead>
                      <TableHead className="pr-8">Amount Paid</TableHead>
                      <TableHead>Pending Amount</TableHead>
                      <TableHead className=" pl-6">Due Date</TableHead>
                      <TableHead className="-pr-6 pl-13">Status</TableHead>
                      <TableHead className="-pr-6 pl-13" >Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerDebts.map((debt) => {
                      const status = getDebtStatus(debt.dueDate, debt.pendingAmount);
                      return (
                        <TableRow key={debt.id}>
                          <TableCell className="px-4 py-4">
                            <div className="text-[hsl(216,32%,17%)] font-medium text-foreground">{debt.customerName}</div>
                          </TableCell>
                          <TableCell className="text-[hsl(216,32%,17%)] pl-4 py-6 font-medium">${debt.totalDebt.toFixed(2)}</TableCell>
                          <TableCell className="py-6 text-[hsl(142,76%,36%)]">${debt.paidAmount.toFixed(2)}</TableCell>
                          <TableCell className="py-6 text-[hsl(0,84%,60%)] font-medium">
                            ${debt.pendingAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="pl-6 text-[hsl(216,20%,45%)]">{debt.dueDate}</TableCell>
                          <TableCell>
                            <Badge className="px-[10px] -mr-6 ml-11" variant={status.variant}>{status.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                className="-mr-9 ml-11 cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(248,250%,96%)] border-[hsl(214,20%,88%)] transition-smooth"
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDebt(debt, 'customer')}
                              >
                                View Details
                              </Button>
                              {debt.pendingAmount > 0 && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="ml-11 rounded-[10px] bg-gradient-to-l from-blue-400 to-blue-500 text-white"
                                  onClick={() => handleViewDebt(debt, 'customer')}
                                >
                                  Collect Payment
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplier Debts */}
        <TabsContent value="suppliers">
          <Card className="gradient-card -mt-[5px] shadow-none">
            <CardHeader>
              <CardTitle className="text-[hsl(216,32%,17%)]  flex items-center gap-2">
                <Truck className="h-5 w-5 text-[hsl(0,84%,60%)]" />
                Supplier Debts
              </CardTitle>
              <CardDescription className="-mt-[4px]">
                Money owed to suppliers for purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-[hsl(214,20%,88%)] rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="p-[14px] px-[16px]">Supplier</TableHead>
                      <TableHead  className="p-[14px] px-[6px]">Total Debt</TableHead>
                      <TableHead  className="p-[14px]">Amount Paid</TableHead>
                      <TableHead  className="p-[14px]">Pending Amount</TableHead>
                      <TableHead  className="p-[14px]">Due Date</TableHead>
                      <TableHead  className="p-[14px]">Status</TableHead>
                      <TableHead  className="p-[14px] pl-[8px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierDebts.map((debt) => {
                      const status = getDebtStatus(debt.dueDate, debt.pendingAmount);
                      return (
                        <TableRow key={debt.id}>
                          <TableCell>
                            <div className="font-medium px-[8px] py-[16px] text-[hsl(216,32%,17%)]">{debt.supplierName}</div>
                          </TableCell>
                          <TableCell className="font-medium  px-[6px] text-[hsl(216,32%,17%)]">${debt.totalDebt.toFixed(2)}</TableCell>
                          <TableCell className="text-[hsl(142,76%,36%)] pl-[14px]">${debt.paidAmount.toFixed(2)}</TableCell>
                          <TableCell className="text-[hsl(0,84%,60%)] pl-[14px] font-medium">
                            ${debt.pendingAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className=" pl-[14px] text-[hsl(216,20%,45%)]">{debt.dueDate}</TableCell>
                          <TableCell className=" pl-[14px]">
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                className="cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(248,250%,96%)] border-[hsl(214,20%,88%)] transition-smooth"
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDebt(debt, 'supplier')}
                              >
                                View Details
                              </Button>
                              {debt.pendingAmount > 0 && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gradient-primary rounded-[10px] -mr-3 text-white"
                                  onClick={() => handleViewDebt(debt, 'supplier')}
                                >
                                  Make Payment
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Debt Details Dialog */}
      <DebtDetailsDialog
        debt={selectedDebt}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onPaymentUpdate={handlePaymentUpdate}
        type={dialogType}
      />
    </div>
  );
}