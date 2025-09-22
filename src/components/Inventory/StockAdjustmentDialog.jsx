import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function StockAdjustmentDialog({ isOpen, onClose, product, onAdjust }) {
  const [newStock, setNewStock] = useState(product ? product.stockLevel : 0);
  const [type, setType] = useState("add");
  const [reason, setReason] = useState("");

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Stock for {product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-1">Adjustment Type</label>
            <select
              className="w-full border rounded p-2"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Stock Level</label>
            <Input
              type="number"
              value={newStock}
              onChange={e => setNewStock(Number(e.target.value))}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <Input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Restock, Correction, Damage"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              onAdjust(product.id, newStock, type, reason);
              onClose();
            }}
            className="gradient-primary text-white"
          >
            Save Adjustment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
