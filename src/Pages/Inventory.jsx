import { useState, useEffect } from "react";
import { Plus, Search, AlertTriangle, Package, QrCode, Edit, Settings, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarcodeGenerator } from "@/components/BarcodeGenerator";
import { CSVImport } from "@/components/CSVImport";
import { ProductForm } from "@/components/inventory/ProductForm";
import { StockAdjustmentDialog } from "@/components/Inventory/StockAdjustmentDialog";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

export default function Inventory() {

  const [products, setProducts] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [editProductDialog, setEditProductDialog] = useState(false);
  const [stockAdjustmentDialog, setStockAdjustmentDialog] = useState(false);
  const [barcodeDialog, setBarcodeDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await axios.get("http://localhost:3000/products");
       
        const mapped = res.data.map((p) => ({
         
          id: p.id || (p._id ? String(p._id) : undefined),
          _id: p._id,
          name: p.name || p.title || "",
          sku: p.sku || "",
          supplier: p.supplier || "",
          category: p.category || "Uncategorized",
          stockLevel: Number(p.stockLevel ?? p.stock ?? 0),
          minStock: Number(p.minStock ?? p.min ?? 0),
          purchasePrice: Number(p.purchasePrice ?? p.cost ?? 0),
          salePrice: Number(p.salePrice ?? p.price ?? 0),
          status: p.status || "In Stock",
          lastRestocked: p.lastRestocked || null,
          createdAt: p.createdAt || null,
     
          ...p
        }));
        if (mounted) setProducts(mapped);
      } catch (err) {
        console.error("Failed to load products", err);
       
        if (mounted) setProducts([]);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filteredProducts = products.filter(product => {
    const supplier = (product.supplier || "").toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;

    let matchesStock = true;
    if (stockFilter === "low") {
      matchesStock = product.stockLevel <= product.minStock && product.stockLevel > 0;
    } else if (stockFilter === "out") {
      matchesStock = product.stockLevel === 0;
    } else if (stockFilter === "in") {
      matchesStock = product.stockLevel > product.minStock;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  const lowStockCount = products.filter(p => p.stockLevel <= p.minStock).length;
  const totalValue = products.reduce((sum, p) => sum + (Number(p.stockLevel || 0) * Number(p.salePrice || 0)), 0);
  const totalProducts = products.length;

  const getStockStatus = (product) => {
    if (product.stockLevel === 0) return { label: "Out of Stock", variant: "destructive" };
    if (product.stockLevel <= product.minStock) return { label: "Low Stock", variant: "warning" };
    return { label: "In Stock", variant: "success" };
  };

  const handleAddProduct = (productData) => {
    const newProduct = {
      id: `PRD-${Date.now()}`,
      ...productData
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleEditProduct = (productData) => {
    if (!selectedProduct) return;

    setProducts(products.map(p =>
      p.id === selectedProduct.id
        ? { ...selectedProduct, ...productData }
        : p
    ));
    setSelectedProduct(null);
  };

  const handleStockAdjustment = (productId, newStock, type, reason) => {
    setProducts(products.map(p =>
      (p.id === productId || String(p._id) === String(productId))
        ? {
          ...p,
          stockLevel: newStock,
          lastRestocked: type === 'add' ? new Date().toISOString().split('T')[0] : p.lastRestocked
        }
        : p
    ));
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => !(p.id === productId || String(p._id) === String(productId))));
    toast({
      title: "Success",
      description: "Product deleted successfully",
    });
  };

  return (
    <div className="space-y-6 m-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(214,84%,64%)] bg-clip-text ">
            Inventory Management
          </h1>
          <p className="text-[hsl(216,20%,45%)] mt-1">
            Track and manage your product inventory with advanced controls
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CSVImport  onImport={(importedProducts) => {
            const newProducts = importedProducts.map((product, index) => ({
              id: `PRD-${Date.now()}-${index}`,
              ...product
            }));
            setProducts(prev => [...prev, ...newProducts]);
          }} />
          <Button
            variant="outline"
            className="gap-2 shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] hover:shadow-medium hover:bg-[hsl(214,20%,95%)] transition-smooth border-[hsl(214,20%,88%)] rounded-[10px] cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button
            onClick={() => setAddProductDialog(true)}
            className="bg-blue-500 text-white shadow-soft hover:shadow-medium transition-smooth rounded-[10px] cursor-pointer"
          >
            <Plus className="mr-2 cursor-pointer h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          className=" m-5 text-[hsl(216,20%,45%)] hover:shadow-medium p-0.5"
          title="Total Products"
          value={totalProducts}
          icon={Package}
          iconColor="bg-red-300 text-red-700 rounded-[10px]  h-4 w-4 "        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatsCard
          title="Inventory Value"
          value={`؋${totalValue.toLocaleString()}`}
          icon={Package}
          variant="success"
        />
      </div>

      {/* Filters and Search */}
      <Card className="gradient-card shadow-medium border-[hsl(214,20%,88%)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex text-[hsl(216,32%,17%)]  items-center gap-2">
                <Package className="h-5 w-5 text-[hsl(214,84%,50%)]" />
                Product Inventory
              </CardTitle>
              <CardDescription className=" text-[hsl(216,20%,45%)]">Manage your product stock levels and details</CardDescription>
            </div>
            <Badge variant="outline" className="mb-1 tracking-tight text-sm rounded-2xl text-[hsl(216,32%,17%)] border-[hsl(214,20%,88%)]">
              {filteredProducts.length} of {products.length} products
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col xl:flex-row gap-4 mb-6">
            <div className=" relative flex-1 rounded-md bg-gray-50">
              <Search className=" text-[hsl(216,20%,45%)] shadow-[0_1px_2px_-1px_hsl(216,20%,45%,0.5)] absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, SKU, or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-[10px] pl-10 shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] focus:shadow-line focus:ring-2 focus:ring-offset-2 focus:visible:ring-0 focus:ring-blue-500 transition-smooth"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="text-[hsl(216,32%,17%)] rounded-[10px] pl-10 shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] focus:shadow-line focus:ring-2 focus:ring-offset-2 focus:visible:ring-0 transition-all duration-300 focus:ring-blue-500 transition-smooth w-full sm:w-48 focus:shadow-line transition-smooth">
                  <SelectValue className="text-[hsl(216,32%,17%)]" placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className={"bg-white text-[hsl(216,32%,17%)]  rounded-[10px] border-[hsl(214,20%,88%)]"}>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select className="" value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="text-[hsl(216,32%,17%)] transition-all duration-300 w-full sm:w-48 shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] focus:shadow-line rounded-[10px]  transition-smooth">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent className={"bg-white rounded-[10px] border-[hsl(214,20%,88%)] text-[hsl(216,32%,17%)]"}>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Table */}
          <div className="hover:bg-[hsl(0,0%,96%)] hover:transition-all duration-300 border border-[hsl(214,20%,88%)] rounded-[10px] text-[hsl(216,20%,45%)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product);
                  return (
                    <TableRow key={product.id || product._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{product.name}kljkljlj</div>
                          <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{product.stockLevel}</TableCell>
                      <TableCell className="text-muted-foreground">{product.minStock}</TableCell>
                      <TableCell className="text-muted-foreground">؋{Number(product.purchasePrice).toLocaleString()}</TableCell>
                      <TableCell className="font-medium text-success">؋{Number(product.salePrice).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setEditProductDialog(true);
                            }}
                            className="hover:bg-primary/10 hover:text-primary transition-smooth"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setBarcodeDialog(true);
                            }}
                            className="hover:bg-primary/10 hover:text-primary transition-smooth"
                          >
                            <QrCode className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setStockAdjustmentDialog(true);
                            }}
                            className="hover:bg-success/10 hover:text-success transition-smooth"
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ProductForm
        isOpen={addProductDialog}
        onClose={() => setAddProductDialog(false)}
        onSubmit={handleAddProduct}
        mode="add"
      />

      <ProductForm
        isOpen={editProductDialog}
        onClose={() => {
          setEditProductDialog(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEditProduct}
        product={selectedProduct}
        mode="edit"
      />

      <StockAdjustmentDialog
        isOpen={stockAdjustmentDialog}
        onClose={() => {
          setStockAdjustmentDialog(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onAdjust={handleStockAdjustment}
      />

      {selectedProduct && (
        <BarcodeGenerator
          isOpen={barcodeDialog}
          onClose={() => {
            setBarcodeDialog(false);
            setSelectedProduct(null);
          }}
          productSku={selectedProduct.sku}
          productName={selectedProduct.name}
        />
      )}
    </div>
  );
}