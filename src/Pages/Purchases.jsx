
import { useState } from "react";
import { Plus, Search, Calendar, DollarSign, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPurchases, mockProducts } from "@/data/mockData";
import { toast } from "react-hot-toast";

export default function Purchases() {
  const [purchases, setPurchases] = useState(mockPurchases);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
    supplier: "",
    amountPaid: 0,
    dueDate: ""
  });

  const filteredPurchases = purchases.filter(purchase =>
    purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const pendingPayments = purchases
    .filter(purchase => purchase.pendingAmount > 0)
    .reduce((sum, purchase) => sum + purchase.pendingAmount, 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productId || !formData.supplier) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedProduct = mockProducts.find(p => p.id === formData.productId);
    if (!selectedProduct) return;

    const totalAmount = selectedProduct.purchasePrice * formData.quantity;
    const pendingAmount = totalAmount - formData.amountPaid;

    const newPurchase = {
      id: `P${String(purchases.length + 1).padStart(3, '0')}`,
      productId: formData.productId,
      productName: selectedProduct.name,
      quantity: formData.quantity,
      unitPrice: selectedProduct.purchasePrice,
      totalAmount,
      supplier: formData.supplier,
      amountPaid: formData.amountPaid,
      pendingAmount,
      purchaseDate: new Date().toISOString().split('T')[0],
      dueDate: pendingAmount > 0 ? formData.dueDate : undefined
    };

    setPurchases([newPurchase, ...purchases]);
    setIsDialogOpen(false);
    setFormData({
      productId: "",
      quantity: 1,
      supplier: "",
      amountPaid: 0,
      dueDate: ""
    });

    toast.success("Purchase recorded successfully");
  };

  return (
    <div className="space-y-6 m-6 ">
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(216,32%,17%)]">Purchase Management</h1>
          <p className="text-[hsl(216,20%,45%)]">Track supplier purchases and payments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))] text-white shadow-[0_10px_20px_-10px_hsl(214,100%,70%)] rounded-[10px] cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Purchase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[hsl(216,32%,17%)]">Record New Purchase</DialogTitle>
              <DialogDescription className="text-[hsl(216,20%,45%)]">
                Enter the details for the new purchase from supplier.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-5">
                <div className="grid grid-cols-4  items-center gap-4">
                  <Label htmlFor="product" className="text-right">Product</Label>
                  <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                    <SelectTrigger className="col-span-3 bg-[hsl(248,250%,98%)] text-[hsl(216,32%,17%)]">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent className="text-[hsl(216,32%,17%)]">
                      {mockProducts.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ؋{product.purchasePrice.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    className="col-span-3 shadow-none text-[hsl(216,32%,17%)]"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    min="1"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">Supplier</Label>
                  <Input
                    id="supplier"
                    className="col-span-3 shadow-none text-[hsl(216,32%,17%)]"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amountPaid" className="text-right">Amount Paid</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    className="col-span-3 shadow-none text-[hsl(216,32%,17%)]"
                    value={formData.amountPaid}
                    onChange={(e) => setFormData({ ...formData, amountPaid: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">Due Date (if partial)</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    className="col-span-3 shadow-none text-[hsl(216,32%,17%)]"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="gradient-primary text-white">Record Purchase</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4  md:grid-cols-4 ">
        <div className="h-40">
        <StatsCard
          title="Total Purchases"
          value={`؋${totalPurchases.toLocaleString()}`}
          icon={Package}
          trend={{ value: 8.2, label: "from last month" }}
          trendchange="text-[hsl(142,76%,36%)]  -ml-4 mt-[-5px] "
          box={`rounded-[10px] h-35 text-red-600 border bg-card text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
          icanchange="h-8 w-8 mb-2 p-2  -mr-53 rounded-[12px] "            
         />
        </div>
        <StatsCard
          title="Pending Payments"
          value={`؋${pendingPayments.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: -2.4, label: "from last month" }}
          trendchange="text-[hsl(0,84%,60%)] -ml-4 mt-[-5px]"
          box={`rounded-[10px] h-35 text-red-600 border bg-card text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
          icanchange="h-8 w-8 mb-2 p-2  -mr-53 rounded-[12px] "            
        />
        <StatsCard
          title="Active Suppliers"
          value="24"
          icon={User}
          trend={{ value: 12.5, label: "from last month" }}
          trendchange="text-[hsl(142,76%,36%)] -ml-4 mt-[-5px]"
          box={`rounded-[10px] h-35 text-red-600 border bg-card text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
          icanchange="h-8 w-8 mb-2 p-2  -mr-53 rounded-[12px] "            
       />
        <StatsCard
          title="Purchase Orders"
          value="87"
          icon={Calendar}
          trend={{ value: 5.1, label: "from last month" }}
          trendchange="text-[hsl(142,76%,36%)] -ml-4 mt-[-5px]"
          box={`rounded-[10px] h-35 text-red-600 border bg-card text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
          icanchange="h-8 w-8 mb-2 p-2  -mr-53 rounded-[12px] "
      />
      </div>

      <Card className="bg-white -mt-5 h-80 border-[hsl(214,20%,88%)] ">
        <CardHeader>
          <CardTitle className=" text-[hsl(216,32%,17%)]">Recent Purchases</CardTitle>
          <CardDescription className="text-[hsl(216,20%,45%)]">Manage your supplier purchases and payments</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className=" absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search purchases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-[hsl(248,250%,99%)] shadow-none"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchase ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium text-[hsl(216,32%,17%)]">#{purchase.id}</TableCell>
                  <TableCell className="text-[hsl(216,32%,17%)]">{purchase.supplier}</TableCell>
                  <TableCell className="text-[hsl(216,32%,17%)]">{purchase.productName}</TableCell>
                  <TableCell className="text-[hsl(216,32%,17%)]">{purchase.quantity}</TableCell>
                  <TableCell className="text-[hsl(216,32%,17%)]">${purchase.unitPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-[hsl(216,32%,17%)]">؋{purchase.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={purchase.pendingAmount === 0 ? "default" : "destructive"}>
                      {purchase.pendingAmount === 0 ? "paid" : "pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[hsl(216,32%,17%)]">{purchase.purchaseDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}