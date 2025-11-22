import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "react-hot-toast";
import { Package, Plus, Minus } from "lucide-react";

export function StockAdjustmentDialog({ isOpen, onClose, product, onAdjust }) {
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!product) return;

    if (quantity <= 0 && adjustmentType !== "set") {
      Toaster({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      Toaster({
        title: "Error",
        description: "Please provide a reason for the adjustment",
        variant: "destructive",
      });
      return;
    }

    let newStock;

    switch (adjustmentType) {
      case "add":
        newStock = product.stockLevel + quantity;
        break;
      case "subtract":
        newStock = Math.max(0, product.stockLevel - quantity);
        break;
      case "set":
        newStock = Math.max(0, quantity);
        break;
      default:
        newStock = product.stockLevel;
    }

    onAdjust(product.id, newStock, adjustmentType, reason);
    onClose();

    // Reset form
    setQuantity(0);
    setReason("");
    setAdjustmentType("add");

    Toaster({
      title: "Success",
      description: `Stock adjusted successfully. New stock level: ${newStock}`,
    });
  };

  if (!product) return null;

  const getNewStockLevel = () => {
    switch (adjustmentType) {
      case "add":
        return product.stockLevel + quantity;
      case "subtract":
        return Math.max(0, product.stockLevel - quantity);
      case "set":
        return Math.max(0, quantity);
      default:
        return product.stockLevel;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gradient-card h-138 shadow-medium">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[hsl(216,32%,17%)]">
            <Package className="h-5 w-5 text-[hsl(214,84%,56%)]" />
            Stock Adjustment
          </DialogTitle>
          <DialogDescription className="text-[hsl(216,20%,45%)]">
            Adjust inventory levels for {product.name} (SKU: {product.sku})
          </DialogDescription>
        </DialogHeader>

        <div className="bg-[hsl(210deg,14.29%,95.25%)]/50 rounded-[12px] p-4 mb-6">
          <div className="flex items-center  justify-between">
            <span className="text-sm text-[hsl(216,20%,45%)]">Current Stock:</span>
            <span className="font-semibold text-[hsl(216,32%,17%)] text-lg">{product.stockLevel}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-[hsl(216,20%,45%)]">
              New Stock Level:
            </span>
            <span className="font-semibold text-lg text-[hsl(214,84%,56%)]">
              {getNewStockLevel()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adjustmentType" className="text-sm text-[hsl(216,32%,17%)] font-medium">
              Adjustment Type
            </Label>
            <Select
              value={adjustmentType}
              onValueChange={(value) => setAdjustmentType(value)}
            >
              <SelectTrigger className="shadow-soft  bg-[hsl(214,20%,97%)] text-[hsl(216,32%,17%)] focus:shadow-glow transition-smooth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={"shadow-soft bg-white"}>
                <SelectItem value="add">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-[hsl(142,76%,45%)]" />
                    Add Stock (Restock)
                  </div>
                </SelectItem>
                <SelectItem value="subtract">
                  <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4 text-[hsl(38,92%,55%)]" />
                    Remove Stock (Damage/Loss)
                  </div>
                </SelectItem>
                <SelectItem value="set">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[hsl(214,84%,56%)]" />
                    Set Exact Stock (Inventory Count)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm text-[hsl(216,32%,17%)] font-medium">
              {adjustmentType === "set" ? "New Stock Level" : "Quantity"}
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder={
                adjustmentType === "set"
                  ? "Enter exact stock level"
                  : "Enter quantity"
              }
              min="0"
              className="shadow-soft bg-[hsl(214,20%,97%)] text-[hsl(216,32%,17%)] focus:shadow-glow transition-smooth"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm text-[hsl(216,32%,17%)] font-medium">
              Reason for Adjustment
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="shadow-soft bg-[hsl(214,20%,97%)] text-[hsl(216,32%,17%)] focus:shadow-glow transition-smooth">
                <SelectValue  placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent className={"shadow-soft bg-white"}>
                {adjustmentType === "add" && (
                  <>
                    <SelectItem value="restock">New Stock Received</SelectItem>
                    <SelectItem value="return">Customer Return</SelectItem>
                    <SelectItem value="found">Found Inventory</SelectItem>
                  </>
                )}
                {adjustmentType === "subtract" && (
                  <>
                    <SelectItem value="damage">Damaged Goods</SelectItem>
                    <SelectItem value="theft">Theft/Loss</SelectItem>
                    <SelectItem value="expired">Expired Products</SelectItem>
                    <SelectItem value="sample">Used as Sample</SelectItem>
                  </>
                )}
                {adjustmentType === "set" && (
                  <>
                    <SelectItem value="count">
                      Physical Inventory Count
                    </SelectItem>
                    <SelectItem value="correction">Stock Correction</SelectItem>
                    <SelectItem value="audit">Inventory Audit</SelectItem>
                  </>
                )}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {reason === "other" && (
              <Textarea
                placeholder="Please specify the reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="shadow-soft focus:shadow-glow transition-smooth mt-2"
              />
            )}
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer  mr-2  rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] border-[hsl(214,20%,88%)] hover:shadow-medium transition-smooth"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary text-white shadow-soft hover:shadow-medium transition-smooth"
            >
              Adjust Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
