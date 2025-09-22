import { toast } from "react-hot-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


const Categories = ["Electronics", "Accessories", "Office", "Clothing", "Books", "Home & Garden"];

export function ProductForm({ isOpen, onClose, onSubmit, product, mode }) {

    const [formData, setFormData] = useState({
        name: product?.name || "",
        sku: product?.sku || "",
        category: product?.category || "",
        stockLevel: product?.stockLevel || 0,
        minStock: product?.minStock || 0,
        purchasePrice: product?.purchasePrice || 0,
        salePrice: product?.salePrice || 0,
        supplier: product?.supplier || "",
        description: product?.description || ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.sku || !formData.category) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        const productData = {
            ...formData,
            lastRestocked: new Date().toISOString().split('T')[0]
        };

        onSubmit(productData);
        onClose();

        setFormData({
            name: "",
            sku: "",
            category: "",
            stockLevel: 0,
            minStock: 0,
            purchasePrice: 0,
            salePrice: 0,
            supplier: "",
            description: ""
        });

        toast({
            title: "Success",
            description: `Product ${mode === 'add' ? 'added' : 'updated'} successfully`,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl gradient-card">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        {mode === 'add' ? 'Add New Product' : 'Edit Product'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'add'
                            ? 'Enter the details for the new product.'
                            : 'Update the product information below.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* تمام فیلدهای فرم بدون تغییر باقی مانده‌اند */}
                        {/* ... */}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter product description (optional)"
                            className="shadow-soft focus:shadow-glow transition-smooth min-h-[80px]"
                        />
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
                            {mode === 'add' ? 'Add Product' : 'Update Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
