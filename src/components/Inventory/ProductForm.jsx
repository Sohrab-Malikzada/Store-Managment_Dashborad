import { useState } from "react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ✅ درستش اینه:
import { Toaster, toast } from "sonner";

const categories = ["Electronics", "Accessories", "Office", "Clothing", "Books", "Home & Garden"];

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
      toast.error("Please fill in all required fields");
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

    toast.success(`Product ${mode === 'add' ? 'added' : 'updated'} successfully`);
  };

  return (
    <>
      {/* ✅ باید فقط یکبار در کل اپ یا اینجا اضافه بشه */}
      <Toaster position="top-right" />

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-166 gradient-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[hsl(216,32%,17%)]">
              {mode === 'add' ? 'Add New Product' : 'Edit Product'}
            </DialogTitle>
            <DialogDescription className="text-[hsl(216,20%,45%)]">
              {mode === 'add' 
                ? 'Enter the details for the new product.' 
                : 'Update the product information below.'
              }
            </DialogDescription>
          </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 -mt-2 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-[hsl(216,32%,17%)] font-medium">Product Name *</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter product name"
                  className="shadow-soft h-10 bg-[hsl(214,20%,98%)] focus:shadow-none transition-smooth"
                required
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="sku" className="text-sm text-[hsl(216,32%,17%)] font-medium">SKU *</Label>
              <Input 
                id="sku" 
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                placeholder="Enter SKU"
                  className="shadow-soft h-10 bg-[hsl(214,20%,98%)] focus:shadow-none transition-smooth"
                required
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="category" className="text-sm text-[hsl(216,32%,17%)] font-medium">Category *</Label>
                <Select  value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="shadow-soft  text-[hsl(216,32%,17%)] focus:shadow-none transition-smooth">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                  <SelectContent className={"shadow-soft  text-[hsl(216,32%,17%)] bg-white"}>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-sm text-[hsl(216,32%,17%)] font-medium">Supplier</Label>
              <Input 
                id="supplier" 
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                placeholder="Enter supplier name"
                  className="shadow-soft h-10 bg-[hsl(214,20%,98%)] focus:shadow-none transition-smooth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockLevel" className="text-sm text-[hsl(216,32%,17%)] font-medium">Current Stock</Label>
              <Input 
                id="stockLevel" 
                type="number" 
                value={formData.stockLevel}
                onChange={(e) => setFormData({...formData, stockLevel: parseInt(e.target.value) || 0})}
                placeholder="0"
                min="0"
                  className="shadow-soft h-10 bg-[hsl(214,20%,98%)] focus:shadow-none transition-smooth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock" className="text-sm text-[hsl(216,32%,17%)] font-medium">Minimum Stock Alert</Label>
              <Input 
                id="minStock" 
                type="number" 
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                placeholder="0"
                min="0"
                  className="shadow-soft h-10 bg-[hsl(214,20%,98%)] focus:shadow-none transition-smooth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchasePrice" className="text-sm text-[hsl(216,32%,17%)] font-medium">Purchase Price (؋)</Label>
              <Input 
                id="purchasePrice" 
                type="number" 
                value={formData.purchasePrice}
                onChange={(e) => setFormData({...formData, purchasePrice: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
                min="0"
                step="0.01"
                  className="shadow-soft h-10 bg-[hsl(214,20%,98%)] focus:shadow-none transition-smooth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salePrice" className="text-sm text-[hsl(216,32%,17%)] font-medium">Sale Price (؋)</Label>
              <Input 
                id="salePrice" 
                type="number" 
                value={formData.salePrice}
                onChange={(e) => setFormData({...formData, salePrice: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
                min="0"
                step="0.01"
                  className="shadow-soft h-10 bg-[hsl(214,20%,98%)] focus:shadow-none transition-smooth"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="mt-8 text-sm text-[hsl(216,32%,17%)] font-medium">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter product description (optional)"
                className="shadow-soft  bg-[hsl(214,20%,98%)] focus:shadow-none transition-smooth"
            />
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
              {mode === 'add' ? 'Add Product' : 'Update Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
