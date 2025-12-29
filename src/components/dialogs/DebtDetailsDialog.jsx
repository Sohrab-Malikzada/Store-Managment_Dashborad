import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { mockCustomerDebts } from "@/data/mockData";

export function DebtDetailsDialog({ debt, isOpen, onClose, onPaymentUpdate, type }) {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  if (!debt) return null;

  const debtorName = type === 'customer'
    ? debt.customerName
    : debt.supplierName;

  const handlePayment = () => {
    if (paymentAmount <= 0 || paymentAmount > debt.pendingAmount) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be between $0.01 and pending amount",
        variant: "destructive",
      });
      return;
    }

    onPaymentUpdate(debt.id, paymentAmount);
    setPaymentAmount(0);
    setShowPaymentForm(false);
    onClose();

    toast({
      title: "Payment Recorded",
      description: `Payment of $${paymentAmount.toFixed(2)} has been recorded`,
    });
  };

  const getStatus = () => {
    if (debt.pendingAmount === 0) return { label: "Paid", variant: "success" };

    const due = new Date(debt.dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return { label: "Overdue", variant: "destructive" };
    if (daysUntilDue <= 7) return { label: "Due Soon", variant: "warning" };
    return { label: "Active", variant: "default" };
  };

  const status = getStatus();

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="w-90 sm:w-full sm:h-140 md:h-auto lg:h-100 overflow-auto no-scrollbar rounded-[12px]">
        <DialogHeader>
          <DialogTitle className="text-left tracking-tight text-[hsl(216,32%,17%)] text-xl font-bold">
            {type === 'customer' ? 'Customer' : 'Supplier'} Debt Details
          </DialogTitle>
          <DialogDescription className="text-left">
            Complete payment information and history
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Debtor Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[hsl(216,32%,17%)]">
              {type === 'customer' ? 'Customer' : 'Supplier'} Information
            </h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Name:</span>
                <span className="font-medium text-[hsl(216,32%,17%)]">{debtorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Debt ID:</span>
                <span className="font-medium text-[hsl(216,32%,17%)]">{debt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Due Date:</span>
                <span className="font-medium text-[hsl(216,32%,17%)]">{debt.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Status:</span>
                <Badge className="mt-0 px-[10px] py-[3px] " variant={status.variant}>{status.label}</Badge>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[hsl(216,32%,17%)]">Payment Summary</h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Total Debt:</span>
                <span className="font-bold text-[hsl(216,32%,17%)] text-lg">${debt.totalDebt.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Amount Paid:</span>
                <span className="font-medium text-[hsl(142,76%,36%)]">${debt.paidAmount.toFixed(2)}</span>
              </div>
              <div className="h-px  border-[1px] border-[hsl(214,20%,93%)]"></div>
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Pending Amount:</span>
                <span className="font-bold text-lg text-[hsl(0,84%,60%)]">${debt.pendingAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          {debt.pendingAmount > 0 && (
            <div className="space-y-3">
              {!showPaymentForm ? (
                <Button
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full gradient-primary text-white"
                >
                  {type === 'customer' ? 'Collect Payment' : 'Make Payment'}
                </Button>
              ) : (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-[hsl(216,32%,17%)]">
                    {type === 'customer' ? 'Collect Payment' : 'Make Payment'}
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="payment" className="mt-6 mb-3 text-[hsl(216,32%,17%)]">Payment Amount</Label>
                    <Input
                      className="shadow-none"
                      id="payment"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={debt.pendingAmount}
                      value={paymentAmount || ''}
                      onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                      placeholder={`Max: $${debt.pendingAmount.toFixed(2)}`}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentForm(false)}
                      className="flex-1 cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(248,250%,96%)] border-[hsl(214,20%,88%)]  transition-smooth"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePayment}
                      className="flex-1 gradient-primary text-white"
                    >
                      Confirm Payment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
