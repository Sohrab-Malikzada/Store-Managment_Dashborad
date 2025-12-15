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

  // تابع خروجی گرفتن از محصولات (CSV)
  const exportProducts = (useFiltered = true) => {
    try {
      // filteredProducts تعریف نشده هنوز در کد بالا، اما در زمان اجرا این تابع بعد از تعریف filteredProducts فراخوانی می‌شود.
      const rows = (useFiltered ? filteredProducts : products) || [];

      if (!rows.length) {
        toast.error("هیچ محصولی برای خروجی وجود ندارد");
        return;
      }

      const headers = [
        "id",
        "name",
        "sku",
        "supplier",
        "category",
        "stockLevel",
        "minStock",
        "purchasePrice",
        "salePrice",
        "status",
        "lastRestocked",
        "createdAt"
      ];

      const escapeCell = (val) => {
        if (val === null || val === undefined) return "";
        const s = String(val);
        if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
          return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
      };

      const csvRows = [];
      csvRows.push(headers.join(","));

      for (const p of rows) {
        const line = headers.map((h) => {
          const v = p[h] ?? (p._raw && p._raw[h]) ?? "";
          return escapeCell(v);
        }).join(",");
        csvRows.push(line);
      }

      const csvString = csvRows.join("\r\n");
      const blob = new Blob(["\uFEFF", csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const date = new Date().toISOString().split("T")[0];
      a.download = `products-export-${date}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`خروجی آماده شد (${rows.length} ردیف)`);
    } catch (err) {
      console.error("Export error:", err);
      toast.error("خطا در خروجی گرفتن از محصولات");
    }
  };

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
    <div className=" overflow-scroll space-y-6 m-6">
      <Toaster />
      {/* Header */}
      <div className="flex  flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-3xl font-bold text-[hsl(214,84%,64%)] bg-clip-text ">
            Inventory Management
          </h1>
          <p className="text-[hsl(216,20%,45%)] w-full md:w-full lg:w-90 mt-1">
            Track and manage your product inventory with advanced controls
          </p>
        </div>
        <div className="flex flex-row sm:flex-row lg:flex-nowrap ml-0 sm:ml-2 lg:ml-0 gap-3">
          <CSVImport onImport={(importedProducts) => {
            const newProducts = importedProducts.map((product, index) => ({
              id: `PRD-${Date.now()}-${index}`,
              ...product
            }));
            setProducts(prev => [...prev, ...newProducts]);
          }} />
          <Button
            variant="outline"
            className="-ml-2 sm:-ml-0 gap-0 sm:gap-2 w-20 sm:w-[100px] md:w-[105px] lg:[110px] text-[hsl(216,32%,17%)] shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] hover:shadow-medium hover:bg-[hsl(214,20%,95%)] transition-smooth border-[hsl(214,20%,88%)] rounded-[10px] cursor-pointer"
            onClick={() => exportProducts(true)} // صادر کردن محصولات فیلترشده
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button
            onClick={() => setAddProductDialog(true)}
            className="-ml-2 sm:-ml-0 gradient-primary w-28 sm:w-[140px]  text-white shadow-[0_10px_7px_-10px_hsl(214,80%,70%)] hover:shadow-medium transition-smooth rounded-[10px] cursor-pointer"
          >
            <Plus className="mr-0 sm:mr-2 cursor-pointer h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2">
        <StatsCard
          className="m-5  text-[hsl(216,20%,45%)] hover:shadow-medium p-0.5"
          title="Total Products"
          value={totalProducts}
          icon={Package}
          variant="warning"
          box="rounded-[12px] w-full   h-[122px] shadow-none"
          titlechange="mt-[-7px]"
          icanchange="items-center absolute -right-5 md:-right-6 lg:-right-5 h-4 w-4"
          iconColor="bg-[hsl(211,100%,50%))]/10   text-[hsl(214,84%,56%)] rounded-[12px] p-2 h-8 w-8" />
        <StatsCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={AlertTriangle}
          icanchange="items-center absolute -right-5 md:-right-6 lg:-right-5 h-4 w-4"
          iconColor="bg-[hsl(38,92%,55%)]/10 text-[hsl(35,96%,60%)] rounded-[12px] p-2 h-8 w-8"
          variant="warning"
          box="rounded-[12px]  w-full h-[122px] shadow-none"
          titlechange="mt-[-7px]"
        />
        <StatsCard
          title="Inventory Value"
          value={`؋${totalValue.toLocaleString()}`}
          icon={Package}
          icanchange="items-center absolute -right-5 md:-right-6 lg:-right-5 h-4 w-4"
          iconColor="bg-[hsl(142,76%,36%)]/10 text-[hsl(144,100%,29%)] rounded-[12px] p-2 h-8 w-8"
          variant="success"
          box="rounded-[12px] w-full  h-[122px] shadow-none"
          titlechange="mt-[-7px]"
        />
      </div>

      {/* Filters and Search */}
      <Card className="gradient-card h-auto grid grid-cols-1  rounded-[12px] shadow-medium border-[hsl(214,20%,88%)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex mb-2 text-2xl w-60 text-[hsl(216,32%,17%)]  items-center gap-2">
                <Package className="h-5 w-5 text-[hsl(214,84%,56%)]" />
                Product Inventory
              </CardTitle>
              <CardDescription className=" text-[hsl(216,20%,45%)] mt-[-4px]">Manage your product stock levels and details</CardDescription>
            </div>
            <Badge variant="outline" className="w-29 mb-[-70px] sm:mb-[20px] -ml-30  border-[hsl(214,20%,88%)]  text-sm rounded-2xl text-[hsl(216,32%,17%)]">
              {filteredProducts.length} of {products.length} products
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col xl:flex-row gap-4 mb-6">
            <div className=" relative  flex-1 rounded-md bg-gray-50">
              <Search className="text-[hsl(216,20%,45%)] mt-[-5px] shadow-[0_1px_2px_-1px_hsl(216,20%,45%,0.5)] absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
              <Input
                placeholder="Search products, SKU, or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-[-28px] rounded-[10px] pl-10 shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] focus:shadow-line focus:ring-2 focus:ring-offset-2 focus:visible:ring-0 focus:ring-blue-500 transition-smooth"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="text-[hsl(216,32%,17%)]  mt-[-9px] rounded-[10px] pl-3 shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] focus:shadow-line focus:ring-2 focus:ring-offset-2 focus:visible:ring-0 transition-all duration-300 focus:ring-blue-500 transition-smooth w-full md:w-50 lg:w-[48%] focus:shadow-line transition-smooth">
                  <SelectValue className="text-[hsl(216,32%,17%)]" placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className={"bg-white text-[hsl(216,32%,17%)] rounded-[10px] border-[hsl(214,20%,88%)]"}>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select className="" value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="text-[hsl(216,32%,17%)]  mt-[-9px] rounded-[10px] pl-3 shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] focus:shadow-line focus:ring-2 focus:ring-offset-2 focus:visible:ring-0 transition-all duration-300 focus:ring-blue-500 transition-smooth w-full md:w-50 lg:w-[48%] focus:shadow-line transition-smooth">
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
          <div className="overflow-x-auto hover:transition-all mt-[25px] duration-300 border border-[hsl(214,20%,88%)] rounded-[10px] text-[hsl(216,20%,45%)]">
            <Table className="min-w-max">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4 py-[14px]">Product</TableHead>
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
                      <TableCell className="pl-4">
                        <div>
                          <div className="font-medium text-[hsl(216,32%,17%)]">{product.name}</div>
                          <div className="text-sm text-[hsl(216,20%,45%)]">SKU: {product.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="text-[hsl(216,32%,17%)] rounded-full border-[hsl(214,20%,88%)]" variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-[hsl(216,32%,17%)]">{product.stockLevel}</TableCell>
                      <TableCell className="text-[hsl(216,20%,45%)]">{product.minStock}</TableCell>
                      <TableCell className="text-[hsl(216,20%,45%)]">؋{Number(product.purchasePrice).toLocaleString()}</TableCell>
                      <TableCell className="font-medium text-[hsl(142,76%,36%)]">؋{Number(product.salePrice).toLocaleString()}</TableCell>
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
                            className="cursor-pointer border-[hsl(214,20%,85%)] rounded-[10px] my-2 text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(214,84%,60%)]/10 hover:text-[hsl(38,92%,55%)] transition-smooth"
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
                            className="cursor-pointer border-[hsl(214,20%,85%)] rounded-[10px] my-2 text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(214,84%,60%)]/10 hover:text-[hsl(214,84%,56%)] transition-smooth"
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
                            className="cursor-pointer border-[hsl(214,20%,85%)] rounded-[10px] my-2 text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(214,84%,60%)]/10 hover:text-[hsl(142,76%,36%)] transition-smooth"
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
