import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Minus } from "lucide-react";

export function StockAdjustmentDialog({ isOpen, onClose, product, onAdjust }) {
    const { toast } = useToast();
    const [adjustmentType, setAdjustmentType] = useState('add');
    const [quantity, setQuantity] = useState(0);
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!product) return;

        if (quantity <= 0 && adjustmentType !== 'set') {
            toast({
                title: "Error",
                description: "Please enter a valid quantity",
                variant: "destructive",
            });
            return;
        }

        if (!reason.trim()) {
            toast({
                title: "Error",
                description: "Please provide a reason for the adjustment",
                variant: "destructive",
            });
            return;
        }

        let newStock;

        switch (adjustmentType) {
            case 'add':
                newStock = product.stockLevel + quantity;
                break;
            case 'subtract':
                newStock = Math.max(0, product.stockLevel - quantity);
                break;
            case 'set':
                newStock = Math.max(0, quantity);
                break;
            default:
                newStock = product.stockLevel;
        }

        onAdjust(product.id, newStock, adjustmentType, reason);
        onClose();

        setQuantity(0);
        setReason('');
        setAdjustmentType('add');

        toast({
            title: "Success",
            description: `Stock adjusted successfully. New stock level: ${newStock}`,
        });
    };

    if (!product) return null;

    const getNewStockLevel = () => {
        switch (adjustmentType) {
            case 'add':
                return product.stockLevel + quantity;
            case 'subtract':
                return Math.max(0, product.stockLevel - quantity);
            case 'set':
                return Math.max(0, quantity);
            default:
                return product.stockLevel;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="gradient-card shadow-medium">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        <Package className="h-5 w-5 text-primary" />
                        Stock Adjustment
                    </DialogTitle>
                    <DialogDescription>
                        Adjust inventory levels for {product.name} (SKU: {product.sku})
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Stock:</span>
                        <span className="font-semibold text-lg">{product.stockLevel}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">New Stock Level:</span>
                        <span className="font-semibold text-lg text-primary">{getNewStockLevel()}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="adjustmentType" className="text-sm font-medium">Adjustment Type</Label>
                        <Select value={adjustmentType} onValueChange={(value) => setAdjustmentType(value)}>
                            <SelectTrigger className="shadow-soft focus:shadow-glow transition-smooth">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="add">
                                    <div className="flex items-center gap-2">
                                        <Plus className="h-4 w-4 text-success" />
                                        Add Stock (Restock)
                                    </div>
                                </SelectItem>
                                <SelectItem value="subtract">
                                    <div className="flex items-center gap-2">
                                        <Minus className="h-4 w-4 text-warning" />
                                        Remove Stock (Damage/Loss)
                                    </div>
                                </SelectItem>
                                <SelectItem value="set">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-primary" />
                                        Set Exact Stock (Inventory Count)
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity" className="text-sm font-medium">
                            {adjustmentType === 'set' ? 'New Stock Level' : 'Quantity'}
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                            placeholder={adjustmentType === 'set' ? 'Enter exact stock level' : 'Enter quantity'}
                            min="0"
                            className="shadow-soft focus:shadow-glow transition-smooth"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm font-medium">Reason for Adjustment</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger className="shadow-soft focus:shadow-glow transition-smooth">
                                <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {adjustmentType === 'add' && (
                                    <>
                                        <SelectItem value="restock">New Stock Received</SelectItem>
                                        <SelectItem value="return">Customer Return</SelectItem>
                                        <SelectItem value="found">Found Inventory</SelectItem>
                                    </>
                                )}
                                {adjustmentType === 'subtract' && (
                                    <>
                                        <SelectItem value="damage">Damaged Goods</SelectItem>
                                        <SelectItem value="theft">Theft/Loss</SelectItem>
                                        <SelectItem value="expired">Expired Products</SelectItem>
                                        <SelectItem value="sample">Used as Sample</SelectItem>
                                    </>
                                )}
                                {adjustmentType === 'set' && (
                                    <>
                                        <SelectItem value="count">Physical Inventory Count</SelectItem>
                                        <SelectItem value="correction">Stock Correction</SelectItem>
                                        <SelectItem value="audit">Inventory Audit</SelectItem>
                                    </>
                                )}
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {reason === 'other' && (
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
                            className="shadow-soft hover:shadow-medium transition-smooth"
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
