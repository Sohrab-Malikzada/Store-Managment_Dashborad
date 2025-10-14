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
      <DialogContent className="gradient-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Advance Payment
          </DialogTitle>
          <DialogDescription>
            Provide advance salary payments to employees
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label>Select Employee</Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger>
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
              <Card className="bg-muted/20">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Salary</p>
                      <p className="text-lg font-semibold text-primary">${selectedEmployee.salary}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Advances</p>
                      <p className="text-lg font-semibold text-warning">${totalAdvances}</p>
                    </div>
                  </div>
                  
                  {selectedEmployee.advances.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Previous Advances:</p>
                      <div className="space-y-1">
                        {selectedEmployee.advances.slice(-3).map((advance, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{advance.reason}</span>
                            <Badge variant="outline">${advance.amount}</Badge>
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
                <Label htmlFor="amount">Advance Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="shadow-soft focus:shadow-glow transition-smooth"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason-select">Reason</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
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
                  className="shadow-soft focus:shadow-glow transition-smooth"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="gradient-primary shadow-soft hover:shadow-medium"
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
