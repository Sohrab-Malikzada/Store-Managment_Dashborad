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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Sale Details</DialogTitle>
          <DialogDescription>
            Complete sale information and payment details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Sale Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Sale Information</h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sale ID:</span>
                <span className="font-medium">{sale.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium">{sale.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sale Date:</span>
                <span className="font-medium">{sale.saleDate}</span>
              </div>
              {sale.dueDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className="font-medium">{sale.dueDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Type:</span>
                <Badge variant={sale.paymentType === 'full' ? 'success' : 'warning'}>
                  {sale.paymentType === 'full' ? 'Full Payment' : 'Installment'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Items Purchased</h3>
            <div className="border rounded-lg">
              <Table>
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
            <h3 className="font-semibold text-foreground">Payment Summary</h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-bold text-lg">؋{sale.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-medium text-success">؋{sale.amountPaid.toLocaleString()}</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending Amount:</span>
                <span className="font-bold text-lg text-destructive">؋{sale.pendingAmount.toLocaleString()}</span>
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
                      className="flex-1"
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
