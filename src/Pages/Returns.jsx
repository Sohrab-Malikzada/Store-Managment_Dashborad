import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RotateCcw, Plus, Eye, CheckCircle, XCircle, Calendar, Package, ShoppingCart, Users } from "lucide-react";
import { mockSaleReturns, mockPurchaseReturns, mockSales, mockPurchases } from "@/data/mockData";
import { toast } from "react-hot-toast";

export default function Returns() {
  const [saleReturns, setSaleReturns] = useState(mockSaleReturns);
  const [purchaseReturns, setPurchaseReturns] = useState(mockPurchaseReturns);
  const [newSaleReturn, setNewSaleReturn] = useState({
    originalSaleId: "",
    reason: "",
    items: []
  });
  const [newPurchaseReturn, setNewPurchaseReturn] = useState({
    originalPurchaseId: "",
    reason: "",
    quantity: 1
  });
  const [showSaleReturnDialog, setShowSaleReturnDialog] = useState(false);
  const [showPurchaseReturnDialog, setShowPurchaseReturnDialog] = useState(false);


  const handleSaleReturnSubmit = () => {
    const selectedSale = mockSales.find(s => s.id === newSaleReturn.originalSaleId);
    if (!selectedSale) return;

    const newReturn = {
      id: `SR${String(saleReturns.length + 1).padStart(3, '0')}`,
      originalSaleId: newSaleReturn.originalSaleId,
      customerId: selectedSale.customerId || 'C001',
      customerName: selectedSale.customer,
      items: selectedSale.items,
      totalAmount: selectedSale.totalAmount,
      reason: newSaleReturn.reason,
      returnDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setSaleReturns([...saleReturns, newReturn]);
    setNewSaleReturn({ originalSaleId: "", reason: "", items: [] });
    setShowSaleReturnDialog(false);
    toast({
      title: "Sale Return Created",
      description: "Sale return request has been submitted successfully."
    });
  };

  const handlePurchaseReturnSubmit = () => {
    const selectedPurchase = mockPurchases.find(p => p.id === newPurchaseReturn.originalPurchaseId);
    if (!selectedPurchase) return;

    const newReturn = {
      id: `PR${String(purchaseReturns.length + 1).padStart(3, '0')}`,
      originalPurchaseId: newPurchaseReturn.originalPurchaseId,
      supplierId: 'SUP001',
      supplierName: selectedPurchase.supplier,
      productId: selectedPurchase.productId,
      productName: selectedPurchase.productName,
      quantity: newPurchaseReturn.quantity,
      unitPrice: selectedPurchase.unitPrice,
      totalAmount: newPurchaseReturn.quantity * selectedPurchase.unitPrice,
      reason: newPurchaseReturn.reason,
      returnDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setPurchaseReturns([...purchaseReturns, newReturn]);
    setNewPurchaseReturn({ originalPurchaseId: "", reason: "", quantity: 1 });
    setShowPurchaseReturnDialog(false);
    toast({
      title: "Purchase Return Created",
      description: "Purchase return request has been submitted successfully."
    });
  };

  const handleApproveReturn = (type, id) => {
    if (type === 'sale') {
      setSaleReturns(saleReturns.map(r => 
        r.id === id ? { ...r, status: 'approved', processedBy: 'Current User' } : r
      ));
    } else {
      setPurchaseReturns(purchaseReturns.map(r => 
        r.id === id ? { ...r, status: 'approved', processedBy: 'Current User' } : r
      ));
    }
    toast({
      title: "Return Approved",
      description: `${type === 'sale' ? 'Sale' : 'Purchase'} return has been approved successfully.`
    });
  };

  const handleRejectReturn = (type, id) => {
    if (type === 'sale') {
      setSaleReturns(saleReturns.map(r => 
        r.id === id ? { ...r, status: 'rejected', processedBy: 'Current User' } : r
      ));
    } else {
      setPurchaseReturns(purchaseReturns.map(r => 
        r.id === id ? { ...r, status: 'rejected', processedBy: 'Current User' } : r
      ));
    }
    toast({
      title: "Return Rejected",
      description: `${type === 'sale' ? 'Sale' : 'Purchase'} return has been rejected.`
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 p-8 px-13">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Returns Management</h1>
          <p className="text-muted-foreground mt-2">Manage sale and purchase returns</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sale Returns</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{saleReturns.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchase Returns</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseReturns.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {saleReturns.filter(r => r.status === 'pending').length + 
               purchaseReturns.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Returns</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {saleReturns.filter(r => r.status === 'approved').length + 
               purchaseReturns.filter(r => r.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Sale Returns
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Purchase Returns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sale Returns</CardTitle>
                <CardDescription>Manage customer returns</CardDescription>
              </div>
              <Dialog open={showSaleReturnDialog} onOpenChange={setShowSaleReturnDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sale Return
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Sale Return</DialogTitle>
                    <DialogDescription>Create a new sale return request</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Select Sale</Label>
                      <Select value={newSaleReturn.originalSaleId} onValueChange={(value) => setNewSaleReturn({...newSaleReturn, originalSaleId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sale" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSales.map((sale) => (
                            <SelectItem key={sale.id} value={sale.id}>
                              {sale.id} - {sale.customer} - AFN {sale.totalAmount.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Return Reason</Label>
                      <Textarea
                        value={newSaleReturn.reason}
                        onChange={(e) => setNewSaleReturn({...newSaleReturn, reason: e.target.value})}
                        placeholder="Enter reason for return"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaleReturnSubmit} disabled={!newSaleReturn.originalSaleId || !newSaleReturn.reason}>
                        Create Return
                      </Button>
                      <Button variant="outline" onClick={() => setShowSaleReturnDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return ID</TableHead>
                    <TableHead>Original Sale</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saleReturns.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-medium">{returnItem.id}</TableCell>
                      <TableCell>{returnItem.originalSaleId}</TableCell>
                      <TableCell>{returnItem.customerName}</TableCell>
                      <TableCell>AFN {returnItem.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="max-w-xs truncate">{returnItem.reason}</TableCell>
                      <TableCell>{returnItem.returnDate}</TableCell>
                      <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {returnItem.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveReturn('sale', returnItem.id)}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectReturn('sale', returnItem.id)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Purchase Returns</CardTitle>
                <CardDescription>Manage supplier returns</CardDescription>
              </div>
              <Dialog open={showPurchaseReturnDialog} onOpenChange={setShowPurchaseReturnDialog}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Purchase Return
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Purchase Return</DialogTitle>
                    <DialogDescription>Create a new purchase return request</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Select Purchase</Label>
                      <Select value={newPurchaseReturn.originalPurchaseId} onValueChange={(value) => setNewPurchaseReturn({...newPurchaseReturn, originalPurchaseId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a purchase" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPurchases.map((purchase) => (
                            <SelectItem key={purchase.id} value={purchase.id}>
                              {purchase.id} - {purchase.supplier} - AFN {purchase.unitPrice.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min={1}
                        value={newPurchaseReturn.quantity}
                        onChange={(e) => setNewPurchaseReturn({...newPurchaseReturn, quantity: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Return Reason</Label>
                      <Textarea
                        value={newPurchaseReturn.reason}
                        onChange={(e) => setNewPurchaseReturn({...newPurchaseReturn, reason: e.target.value})}
                        placeholder="Enter reason for return"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePurchaseReturnSubmit}
                        disabled={!newPurchaseReturn.originalPurchaseId || !newPurchaseReturn.reason || newPurchaseReturn.quantity < 1}
                      >
                        Create Return
                      </Button>
                      <Button variant="outline" onClick={() => setShowPurchaseReturnDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return ID</TableHead>
                    <TableHead>Original Purchase</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseReturns.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-medium">{returnItem.id}</TableCell>
                      <TableCell>{returnItem.originalPurchaseId}</TableCell>
                      <TableCell>{returnItem.supplierName}</TableCell>
                      <TableCell>{returnItem.productName}</TableCell>
                      <TableCell>{returnItem.quantity}</TableCell>
                      <TableCell>AFN {returnItem.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="max-w-xs truncate">{returnItem.reason}</TableCell>
                      <TableCell>{returnItem.returnDate}</TableCell>
                      <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {returnItem.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveReturn('purchase', returnItem.id)}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectReturn('purchase', returnItem.id)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
