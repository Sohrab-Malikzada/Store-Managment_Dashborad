import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, User, CreditCard } from "lucide-react";

// employees: Array<{ id, name, position, salary, advances: Array<{ amount, date, reason }> }>
// onAdvancePayment: function(employeeId, amount, reason)
export function AdvancePaymentDialog({ 
  isOpen, 
  onClose, 
  employees, 
  onAdvancePayment 
}) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
  const totalAdvances = selectedEmployee?.advances.reduce((sum, adv) => sum + adv.amount, 0) || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedEmployeeId && amount && reason) {
      onAdvancePayment(selectedEmployeeId, parseFloat(amount), reason);
      setSelectedEmployeeId("");
      setAmount("");
      setReason("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gradient-card w-90 lg:h-100 sm:w-full  rounded-[12px] overflow-auto shadow-medium">
        <DialogHeader>
          <DialogTitle className="tracking-tight flex items-center text-[hsl(216,32%,17%)] gap-2">
            <CreditCard className="h-5 w-5 text-[hsl(142,76%,36%)]" />
            Advance Payment
          </DialogTitle>
          <DialogDescription className="text-left mt-[-2px]">
            Provide advance salary payments to employees
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label className="mt-[6px] text-[hsl(216,32%,17%)]">Select Employee</Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger className="mt-[12px] text-[hsl(216,32%,17%)]">
                  <SelectValue placeholder="Choose employee" />
                </SelectTrigger>
                <SelectContent className={"bg-white"}>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {emp.name} - {emp.position}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEmployee && (
              <Card className="bg-muted/20  -mt-2">
                <CardContent className="pt-[-2px] -mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[hsl(216,20%,45%)]">Monthly Salary</p>
                      <p className="text-lg font-semibold text-[hsl(214,84%,56%)]">${selectedEmployee.salary}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[hsl(216,20%,45%)]">Total Advances</p>
                      <p className="text-lg font-semibold text-[hsl(38,92%,55%)]">${totalAdvances}</p>
                    </div>
                  </div>
                  
                  {selectedEmployee.advances.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-[hsl(216,32%,17%)] font-medium mb-2">Previous Advances:</p>
                      <div className="space-y-1">
                        {selectedEmployee.advances.slice(-3).map((advance, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-[hsl(216,20%,45%)]">{advance.reason}</span>
                            <Badge variant="outline" className="border-[hsl(214,20%,88%)] rounded-full text-[hsl(216,32%,17%)]">${advance.amount}</Badge>
                          </div>
                        ))} 
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="mt-[-4px] text-[hsl(216,32%,17%)]">Advance Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="shadow-soft mt-[5px] bg-[hsl(248,250%,98%)] transition-smooth"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason-select" className="mt-[-4px] text-[hsl(216,32%,17%)]">Reason</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="mt-[12px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)]">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent className={"bg-white"}>
                    <SelectItem value="emergency">Medical Emergency</SelectItem>
                    <SelectItem value="personal">Personal Emergency</SelectItem>
                    <SelectItem value="family">Family Event</SelectItem>
                    <SelectItem value="education">Education Fees</SelectItem>
                    <SelectItem value="housing">Housing/Rent</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {reason === "other" && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason">Custom Reason</Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Specify the reason for advance"
                  className="shadow-soft  focus:shadow-glow transition-smooth"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
             type="button"
             variant="outline"
             onClick={onClose} 
             className="mr-[1px] cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(248,250%,96%)] border-[hsl(214,20%,88%)] transition-smooth"
             >
              Cancel
            </Button>
            <Button 
              type="submit"
              className=" mr-[-1px] w-44  gradient-primary cursor-pointer text-[#ffffff] shadow-soft hover:shadow-medium"
              disabled={!selectedEmployeeId || !amount || !reason}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Approve Advance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
