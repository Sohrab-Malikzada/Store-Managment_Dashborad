import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdvancePaymentDialog } from "@/components/AdvancePaymentDialog";
import { PayrollStatsCards } from "@/components/payroll/PayrollStatsCards";
import { PayrollActionsHeader } from "@/components/payroll/PayrollActionsHeader";
import { PayrollTable } from "@/components/payroll/PayrollTable";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { DollarSign, Calendar, Minus, Gift } from "lucide-react";
import { addAdvancePayment } from "@/utils/advancePayments";
import { cn } from "@/lib/utils";

const mockPayrollRecords = [
  {
    id: "PR001",
    employeeId: "EMP001",
    employeeName: "John Smith",
    position: "Sales Manager",
    baseSalary: 5000,
    bonus: 1000,
    deductions: 500,
    netPay: 5500,
    paymentDate: "2024-01-31",
    status: "paid",
    paymentMethod: "Bank Transfer",
    bonusReason: "Q4 Performance Bonus",
    advances: []
  },
  {
    id: "PR002",
    employeeId: "EMP002",
    employeeName: "Sarah Johnson",
    position: "Cashier",
    baseSalary: 3000,
    bonus: 500,
    deductions: 300,
    netPay: 3200,
    paymentDate: "2024-01-31",
    status: "paid",
    paymentMethod: "Bank Transfer",
    bonusReason: "Holiday Bonus",
    advances: [{ amount: 500, date: "2024-01-15", reason: "emergency" }]
  },
  {
    id: "PR003",
    employeeId: "EMP003",
    employeeName: "Mike Wilson",
    position: "Store Assistant",
    baseSalary: 2800,
    bonus: 0,
    deductions: 280,
    netPay: 2520,
    paymentDate: "2024-02-29",
    status: "pending",
    paymentMethod: "Bank Transfer",
    advances: []
  }
];

const mockEmployees = [
  { id: "EMP001", name: "John Smith", position: "Sales Manager", salary: 5000, advances: [] },
  { id: "EMP002", name: "Sarah Johnson", position: "Cashier", salary: 3000, advances: [{ amount: 500, date: "2024-01-15", reason: "emergency" }] },
  { id: "EMP003", name: "Mike Wilson", position: "Store Assistant", salary: 2800, advances: [] },
  { id: "EMP004", name: "Emily Davis", position: "Inventory Manager", salary: 4500, advances: [{ amount: 1000, date: "2024-01-10", reason: "personal" }] }
];

export default function Payroll() {
  const [payrollRecords, setPayrollRecords] = useState(mockPayrollRecords);
  const [selectedPeriod, setSelectedPeriod] = useState("2024-02");
  const [processingDialog, setProcessingDialog] = useState(false);
  const [bonusDialog, setBonusDialog] = useState(false);
  const [deductionDialog, setDeductionDialog] = useState(false);
  const [advanceDialog, setAdvanceDialog] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);


  const totalPaidThisMonth = payrollRecords
    .filter(record => record.paymentDate.startsWith(selectedPeriod) && record.status === "paid")
    .reduce((sum, record) => sum + record.netPay, 0);

  const totalBonusPaid = payrollRecords
    .filter(record => record.paymentDate.startsWith(selectedPeriod) && record.status === "paid")
    .reduce((sum, record) => sum + record.bonus, 0);

  const pendingPayments = payrollRecords.filter(record => record.status === "pending").length;

  const handleProcessPayroll = () => {
    toast.success(`Successfully processed payroll for ${selectedEmployees.length} employees.`);
    setProcessingDialog(false);
    setSelectedEmployees([]);
  };

  const handleAllocateBonus = (formData) => {
    const employees = formData.get("employees");
    const amount = parseFloat(formData.get("amount"));
    const reason = formData.get("reason");
    const occasion = formData.get("occasion");

      toast.success(`Successfully allocated $${amount} bonus to selected employees for ${occasion}.`);
    setBonusDialog(false);
  };

  const handleAddDeduction = (formData) => {
    const employeeId = formData.get("employee");
    const amount = parseFloat(formData.get("amount"));
    const reason = formData.get("reason");

    setPayrollRecords(prev => prev.map(record =>
      record.employeeId === employeeId
        ? {
            ...record,
            deductions: record.deductions + amount,
            netPay: record.baseSalary + record.bonus - (record.deductions + amount)
          }
        : record
    ));

      toast.success(`Successfully added $${amount} deduction for ${reason}.`);
    setDeductionDialog(false);
  };

  const handleAdvancePayment = (employeeId, amount, reason) => {
    const advance = addAdvancePayment(employeeId, amount, reason);

    const updatedEmployees = mockEmployees.map(emp =>
      emp.id === employeeId
        ? {
            ...emp,
            advances: [...emp.advances, {
              amount,
              date: advance.date,
              reason
            }]
          }
        : emp
    );

      toast.success(`Successfully approved $${amount} advance payment for ${reason}.`);
  };

  return (
    <div className="space-y-8 m-6">
      <PayrollActionsHeader
        onAdvancePayment={() => setAdvanceDialog(true)}
        onAddDeduction={() => setDeductionDialog(true)}
        onAllocateBonus={() => setBonusDialog(true)}
        onProcessPayroll={() => setProcessingDialog(true)}
      />

      <PayrollStatsCards 
        payrollRecords={payrollRecords}
        selectedPeriod={selectedPeriod}
      />

      <Card className="gradient-card shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[hsl(214,84%,56%)]" />
                Payroll Records
              </CardTitle>
              <CardDescription>Monthly salary processing and payment history</CardDescription>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48  bg-[hsl(214,20%,98%)] shadow-soft  transition-smooth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={"bg-white"}>
                <SelectItem value="2024-02">February 2024</SelectItem>
                <SelectItem value="2024-01">January 2024</SelectItem>
                <SelectItem value="2023-12">December 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <PayrollTable payrollRecords={payrollRecords} />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={deductionDialog} onOpenChange={setDeductionDialog}>
        <DialogContent className="gradient-card h-107  shadow-medium">
          <DialogHeader >
            <DialogTitle className="flex items-center gap-2 text-[hsl(216,32%,17%)]">
              <Minus className="h-5 w-5 text-[hsl(38,92%,55%)]" />
              Add Employee Deduction
            </DialogTitle>
            <DialogDescription className="mt-[-2px]">
              Apply deductions for taxes, advances, or other adjustments
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddDeduction(formData);
          }}>
            <div className="grid gap-4 py-4 mt-[6px]">
              <div className="space-y-2">
                <Label htmlFor="employee" className="text-[hsl(216,32%,17%)]">Select Employee</Label>
                <Select name="employee" required>
                  <SelectTrigger className="shadow-soft mt-[12px] text-[hsl(216,32%,17%)] bg-[hsl(214,20%,98%)]  transition-smooth">
                    <SelectValue placeholder="Choose employee" />
                  </SelectTrigger>
                  <SelectContent className={"bg-white"}>
                    {mockEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deduction-amount" className="text-[hsl(216,32%,17%)] mt-[-4px]">Deduction Amount (؋)</Label>
                <Input
                  name="amount"
                  type="number"
                  placeholder="Enter deduction amount"
                  className="shadow-soft mt-[4px] bg-[hsl(214,20%,98%)] transition-smooth"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deduction-reason" className="text-[hsl(216,32%,17%)] mt-[6px]">Reason</Label>
                <Select name="reason" required>
                  <SelectTrigger className="shadow-soft mt-[12px]  text-[hsl(216,32%,17%)]  bg-[hsl(214,20%,98%)] transition-smooth">
                    <SelectValue placeholder="Select deduction type" />
                  </SelectTrigger>
                  <SelectContent className={"bg-white"}>
                    <SelectItem value="tax">Tax Deduction</SelectItem>
                    <SelectItem value="advance">Advance Recovery</SelectItem>
                    <SelectItem value="insurance">Insurance Premium</SelectItem>
                    <SelectItem value="loan">Loan Repayment</SelectItem>
                    <SelectItem value="absence">Absence/Late</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDeductionDialog(false)}
                className="mt-[-10px] shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(248,250%,96%)] border-[hsl(214,20%,88%)] hover:shadow-medium transition-smooth"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="outline" 
                className="mt-[-10px] shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer hover:text-[hsl(216,32%,17%))]  hover:bg-[hsl(38,92%,50%)]/10   rounded-[10px] text-[hsl(38,92%,50%)] bg-[hsl(248,250%,98%)] border-[hsl(38,92%,50%)] hover:shadow-medium transition-smooth"
              >
                Add Deduction
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={bonusDialog} onOpenChange={setBonusDialog}>
        <DialogContent className="gradient-card h-144 shadow-medium">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[hsl(216,32%,17%)]">
              <Gift className="h-5 w-5 text-[hsl(214,84%,56%)]" />
              Allocate Employee Bonus
            </DialogTitle>
            <DialogDescription className="-mt-[2px]">
              Distribute bonuses to employees for special occasions or performance rewards
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAllocateBonus(formData);
          }}>
            <div className="grid gap-4 py-7">
              <div className="space-y-2">
                <Label htmlFor="employees" className="text-[hsl(216,32%,17%)] -mt-[6px]">Select Employees</Label>
                <Select name="employees">
                  <SelectTrigger className="shadow-soft bg-[hsl(214,20%,98%)] mt-[12px] text-[hsl(216,32%,17%)] transition-smooth">
                    <SelectValue placeholder="Choose employees" />
                  </SelectTrigger>
                  <SelectContent className={"bg-white"}>
                    <SelectItem value="all">All Employees</SelectItem>
                    {mockEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occasion" className="text-[hsl(216,32%,17%)] -mt-[4px]">Occasion</Label>
                <Select name="occasion">
                  <SelectTrigger className="shadow-soft mt-[12px] bg-[hsl(214,20%,98%)] text-[hsl(216,32%,17%)] transition-smooth">
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent className={"bg-white"}>
                    <SelectItem value="performance">Performance Bonus</SelectItem>
                    <SelectItem value="holiday">Holiday Bonus</SelectItem>
                    <SelectItem value="festival">Festival Bonus</SelectItem>
                    <SelectItem value="achievement">Achievement Bonus</SelectItem>
                    <SelectItem value="annual">Annual Bonus</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-[hsl(216,32%,17%)] -mt-[4px]">Bonus Amount (؋)</Label>
                <Input
                  name="amount"
                  type="number"
                  placeholder="Enter bonus amount"
                  className="shadow-soft mt-[5px] bg-[hsl(214,20%,98%)] transition-smooth"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-[hsl(216,32%,17%)] mt-[5px]">Reason/Notes</Label>
                <Textarea
                  name="reason"
                  placeholder="Enter reason for bonus allocation"
                  className="shadow-soft mt-[12px] bg-[hsl(214,20%,98%)] transition-smooth"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setBonusDialog(false)}
                className="-mt-[16px] shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(248,250%,96%)] border-[hsl(214,20%,88%)] hover:shadow-medium transition-smooth"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="-mt-[16px] gradient-primary text-[#ffffff] shadow-soft hover:shadow-medium transition-smooth"
              >
                Allocate Bonus
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={processingDialog} onOpenChange={setProcessingDialog}>
        <DialogContent className="gradient-card h-137 shadow-medium max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex tracking-tight text-[18px] mt-[-3px] items-center gap-2 text-[hsl(216,32%,17%)]">
              <Calendar className="h-5 w-5 text-[hsl(214,84%,56%)]" />
              Process Monthly Payroll
            </DialogTitle>
            <DialogDescription className="mt-[-6px]">
              Select employees to process payroll payments for the current period
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {mockEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 border border-[hsl(214,20%,88%)] rounded-[12px] hover:bg-muted/20 transition-smooth">
                  <div>
                    <h4 className="font-medium text-[hsl(216,32%,17%)]">{employee.name}</h4>
                    <p className="text-sm text-[hsl(216,20%,45%)]">{employee.position}</p>
                    {employee.advances.length > 0 && (
                      <p className="text-xs text-[hsl(38,92%,50%)]">
                        {employee.advances.length} advance payment(s)
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[hsl(214,84%,56%)]">؋{employee.salary.toLocaleString()}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (selectedEmployees.includes(employee.id)) {
                          setSelectedEmployees(prev => prev.filter(id => id !== employee.id));
                        } else {
                          setSelectedEmployees(prev => [...prev, employee.id]);
                        }
                      }}
                      className={cn(
                        "shadow-soft hover:shadow-medium transition-smooth",
                        selectedEmployees.includes(employee.id) 
                          ? "tracking-tight hover:bg-[hsl(214,20%,95%)] bg-[hsl(214,84%,56%)]  hover:border-[hsl(214,84%,56%)]  hover:text-[hsl(216,32%,17%)] text-[#ffffff] rounded-[11px] px-[14px] py-[18px] mr-[-1px] mt-[-1px] cursor-pointer"
                          : "hover:bg-[hsl(214,84%,56%)]/10 cursor-pointer  bg-[hsl(248,250%,98%)] shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] text-[hsl(216,32%,17%)] rounded-[10px] border-[hsl(214,20%,88%)] hover:border-[hsl(214,20%,88%)] hover:text-[hsl(214,84%,56%)]"
                      )}
                    >
                      {selectedEmployees.includes(employee.id) ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setProcessingDialog(false)}
              className="shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(248,250%,96%)] border-[hsl(214,20%,88%)] hover:shadow-medium transition-smooth"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProcessPayroll}
              disabled={selectedEmployees.length === 0}
              className="gradient-primary text-[#ffffff] shadow-soft hover:shadow-medium transition-smooth"
            >
              Process Payroll ({selectedEmployees.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdvancePaymentDialog
        isOpen={advanceDialog}
        onClose={() => setAdvanceDialog(false)}
        employees={mockEmployees}
        onAdvancePayment={handleAdvancePayment}
      />
    </div>
  );
}