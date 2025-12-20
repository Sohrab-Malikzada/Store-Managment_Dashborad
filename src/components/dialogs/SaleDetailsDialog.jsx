import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function SaleDetailsDialog({ sale, isOpen, onClose, onPaymentUpdate }) {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  if (!sale) return null;

  const handlePayment = () => {
    if (paymentAmount <= 0 || paymentAmount > sale.pendingAmount) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be between ؋0.01 and pending amount",
        variant: "destructive",
      });
      return;
    }

    onPaymentUpdate(sale.id, paymentAmount);
    setPaymentAmount(0);
    setShowPaymentForm(false);
    onClose();

    toast({
      title: "Payment Collected",
      description: `Payment of ؋${paymentAmount.toLocaleString()} has been collected`,
    });
  };

  const getStatus = () => {
    if (sale.pendingAmount === 0) return { label: "Paid", variant: "success" };
    if (sale.amountPaid === 0) return { label: "Unpaid", variant: "destructive" };
    return { label: "Partial", variant: "warning" };
  };

  const status = getStatus();

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="border-[hsl(214,20%,88%)] outline-none rounded-[12px] max-w-90 sm:max-w-130 md:max-w-160 md:max-h-200 lg:h-110 overflow-y-auto no-scrollbar bg-[hsl(248,250%,98%)] h-[90vh] ">
        <DialogHeader>
          <DialogTitle className="text-xl text-left font-bold text-[hsl(216,32%,17%)]">Sale Details</DialogTitle>
          <DialogDescription className="text-left text-[hsl(216,20%,45%)] -mt-1"> 
            Complete sale information and payment details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Sale Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[hsl(216,32%,17%)]">Sale Information</h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Sale ID:</span>
                <span className="font-medium text-[hsl(216,32%,17%)]">{sale.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Customer:</span>
                <span className="font-medium text-[hsl(216,32%,17%)]">{sale.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Sale Date:</span>
                <span className="font-medium text-[hsl(216,32%,17%)]">{sale.saleDate}</span>
              </div>
              {sale.dueDate && (
                <div className="flex justify-between">
                  <span className="text-[hsl(216,20%,45%)]">Due Date:</span>
                  <span className="font-medium text-[hsl(216,32%,17%)]">{sale.dueDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Payment Type:</span>
                <Badge variant={sale.paymentType === 'full' ? 'success' : 'warning'}>
                  {sale.paymentType === 'full' ? 'Full Payment' : 'Installment'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Status:</span>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[hsl(216,32%,17%)]">Items Purchased</h3>
            <div className="border p-2 pb-2  border-[hsl(214,20%,88%)] rounded-[10px]">
              <Table className="overflow-y-scroll no-scrollbar  h-20 text-[hsl(216,32%,17%)]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>؋{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">؋{item.totalAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[hsl(216,32%,17%)]">Payment Summary</h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Total Amount:</span>
                <span className="font-bold text-[hsl(216,32%,17%)] text-lg">؋{sale.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Amount Paid:</span>
                <span className="font-medium text-[hsl(142,76%,36%)]">؋{sale.amountPaid.toLocaleString()}</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between">
                <span className="text-[hsl(216,20%,45%)]">Pending Amount:</span>
                <span className="font-bold text-lg text-[hsl(0,84%,60%)]">؋{sale.pendingAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Guarantor Information */}
          {sale.guarantor && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Guarantor Information</h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{sale.guarantor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Card:</span>
                  <span className="font-medium">{sale.guarantor.idCardNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium">{sale.guarantor.address}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Collection Form */}
          {sale.pendingAmount > 0 && (
            <div className="space-y-3">
              {!showPaymentForm ? (
                <Button 
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full gradient-primary text-white"
                >
                  Collect Payment
                </Button>
              ) : (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground">Collect Payment</h4>
                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment Amount</Label>
                    <Input
                      id="payment"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={sale.pendingAmount}
                      value={paymentAmount || ''}
                      onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                      placeholder={`Max: ؋${sale.pendingAmount.toLocaleString()}`}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPaymentForm(false)}
                        className=" border flex-1  cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(248,250%,96%)] border-[hsl(214,20%,88%)] hover:shadow-medium transition-smooth"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handlePayment}
                      className="flex-1 gradient-primary text-white"
                    >
                      Collect Payment
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
