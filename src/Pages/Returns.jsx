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
        return <Badge variant="secondary" className="rounded-full hover:bg-yellow-100/40 bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="rounded-full hover:bg-green-100/40 bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="rounded-full hover:bg-red-100/40 bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };



  return (
    <div className="space-y-8 m-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(216,32%,17%)]">Returns Management</h1>
          <p className="text-[hsl(216,20%,45%)] mt-2">Manage sale and purchase returns</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1  md:grid-cols-2">
        <Card className="border-l-4 w-full h-28 bg-[hsl(0,0%,100%)] border-l-blue-500 border-r-[hsl(214,20%,88%)] border-b-[hsl(214,20%,88%)] border-t-[hsl(214,20%,88%)] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(216,32%,17%)]">Total Sale Returns</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[hsl(216,20%,45%)]" />
          </CardHeader>
          <CardContent>
            <div className="-mt-5 text-2xl font-bold text-[hsl(216,32%,17%)]">{saleReturns.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 h-28 w-full bg-[hsl(0,0%,100%)] border-l-blue-500 border-r-[hsl(214,20%,88%)] border-b-[hsl(214,20%,88%)] border-t-[hsl(214,20%,88%)] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(216,32%,17%)]">Total Purchase Returns</CardTitle>
            <Package className="h-4 w-4 text-[hsl(216,20%,45%)]" />
          </CardHeader>
          <CardContent>
            <div className="-mt-5 text-2xl font-bold text-[hsl(216,32%,17%)]">{purchaseReturns.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 h-28 w-full bg-[hsl(0,0%,100%)] border-l-[rgb(249,115,22)] border-r-[hsl(214,20%,88%)] border-b-[hsl(214,20%,88%)] border-t-[hsl(214,20%,88%)] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(216,32%,17%)]">Pending Returns</CardTitle>
            <Calendar className="h-4 w-4 text-[hsl(216,20%,45%)]" />
          </CardHeader>
          <CardContent>
            <div className="-mt-5 text-2xl font-bold text-[hsl(216,32%,17%)]">
              {saleReturns.filter(r => r.status === 'pending').length + 
               purchaseReturns.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 h-28 w-full bg-[hsl(0,0%,100%)] border-l-[rgb(34,197,94)] border-r-[hsl(214,20%,88%)] border-b-[hsl(214,20%,88%)] border-t-[hsl(214,20%,88%)] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(216,32%,17%)]">Approved Returns</CardTitle>
            <CheckCircle className="h-4 w-4 text-[hsl(216,20%,45%)]" />
          </CardHeader>
          <CardContent>
            <div className="-mt-5 text-2xl font-bold text-[hsl(216,32%,17%)]">
              {saleReturns.filter(r => r.status === 'approved').length + 
               purchaseReturns.filter(r => r.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="bg-[hsl(214,20%,96%)] rounded[10px]">
          <TabsTrigger value="sales" className="flex text-[hsl(216,20%,45%)] bg-[hsl(214,20%,96%)] items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-[hsl(216,20%,45%)]" />
            Sale Returns
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex text-[hsl(216,20%,45%)] items-center gap-2">
            <Package className="h-4 w-4 text-[hsl(216,20%,45%)]"/>
            Purchase Returns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4 w-[98%]">
          <Card className="bg-[hsl(0,0%,100%)] mt-[10px] border-[hsl(214,20%,88%)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[hsl(216,32%,17%)]">Sale Returns</CardTitle>
                <CardDescription className="text-[hsl(216,20%,45%)]">Manage customer returns</CardDescription>
              </div>
              <Dialog open={showSaleReturnDialog} onOpenChange={setShowSaleReturnDialog}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary w-29 h-8 sm:w-38 sm:h-10 sm:text-sm text-[11px] text-white">
                    <Plus className="h-4 w-4" />
                    Add Sale Return
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm sm:max-w-lg  rounded-[12px]">
                  <DialogHeader>
                    <DialogTitle className="text-left text-[hsl(216,32%,17%)]">Create Sale Return</DialogTitle>
                    <DialogDescription className="text-left text-[hsl(216,20%,45%)]">Create a new sale return request</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[hsl(216,32%,17%)] mb-1">Select Sale</Label>
                      <Select value={newSaleReturn.originalSaleId} onValueChange={(value) => setNewSaleReturn({...newSaleReturn, originalSaleId: value})}>
                        <SelectTrigger className="text-[hsl(216,32%,17%)]">
                          <SelectValue placeholder="Select a sale"  />
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
                      <Label className="text-[hsl(216,32%,17%)] mb-1">Return Reason</Label>
                      <Textarea
                        className="text-[hsl(216,32%,17%)]"
                        value={newSaleReturn.reason}
                        onChange={(e) => setNewSaleReturn({...newSaleReturn, reason: e.target.value})}
                        placeholder="Enter reason for return"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))]  text-white  rounded-[10px] cursor-pointer" onClick={handleSaleReturnSubmit} disabled={!newSaleReturn.originalSaleId || !newSaleReturn.reason}>
                        Create Return
                      </Button>
                      <Button className="hover:bg-[hsl(214,20%,94%)]  cursor-pointer border-[hsl(214,20%,88%)] rounded-[10px] text-[hsl(216,32%,17%)] shadow-none" variant="outline" onClick={() => setShowSaleReturnDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="w-[100%] overflow-auto no-scrollbar">
              <Table className="tablre-fixed w-full">
                <TableHeader>
                  <TableRow className="hover:bg-[hsl(214,20%,97%)] ">
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
                    <TableRow  className="hover:bg-[hsl(214,20%,97%)] not-hover:scroll-smooth" key={returnItem.id}>
                      <TableCell className="font-medium text-[hsl(216,32%,17%)]">{returnItem.id}</TableCell>
                      <TableCell className="text-[hsl(216,32%,17%)]">{returnItem.originalSaleId}</TableCell>
                      <TableCell className="text-[hsl(216,32%,17%)]">{returnItem.customerName}</TableCell>
                      <TableCell className="text-[hsl(216,32%,17%)]">AFN {returnItem.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="max-w-xs truncate text-[hsl(216,32%,17%)]">{returnItem.reason}</TableCell>
                      <TableCell className="text-[hsl(216,32%,17%)]">{returnItem.returnDate}</TableCell>
                      <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {returnItem.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveReturn('sale', returnItem.id)}
                                className="rounded-[10px] bg-[hsl(214,20%,97%)]  text-green-600 hover:text-[hsl(216,32%,17%)] border-green-300 hover:bg-green-50"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectReturn('sale', returnItem.id)}
                                className="rounded-[10px] hover:text-[hsl(216,32%,17%)] bg-[hsl(214,20%,97%)] text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Button className="rounded-[10px] hover:text-black bg-[hsl(214,20%,97%)] border-gray-300 hover:bg-gray-200" size="sm" variant="outline">
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
        

        <TabsContent value="purchases" className="flex flex-col space-y-4 w-full">
          <Card className="bg-[hsl(0,0%,100%)]  mt-[10px] border-[hsl(214,20%,88%)]">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4">              <div className="">
                <CardTitle className="text-[hsl(216,32%,17%)] ">Purchase Returns</CardTitle>
                <CardDescription className="text-[hsl(216,20%,45%)] -mt-1">Manage supplier returns</CardDescription>
              </div>
              <Dialog open={showPurchaseReturnDialog} onOpenChange={setShowPurchaseReturnDialog}>
                <DialogTrigger asChild>
                  <Button className="ml-auto gradient-primary w-35 h-8 sm:text-sm sm:w-43 sm:h-9 text-[11px] text-white">
                    <Plus className="h-4 w-4" />
                    Add Purchase Return
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm sm:max-w-lg rounded-[12px]">
                  <DialogHeader>
                    <DialogTitle className="text-left text-[hsl(216,32%,17%)]">Create Purchase Return</DialogTitle>
                    <DialogDescription className="text-left text-[hsl(216,20%,45%)]">Create a new purchase return request</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[hsl(216,32%,17%)]  mb-1">Select Purchase</Label>
                      <Select value={newPurchaseReturn.originalPurchaseId} onValueChange={(value) => setNewPurchaseReturn({...newPurchaseReturn, originalPurchaseId: value})}>
                        <SelectTrigger className="text-[hsl(216,32%,17%)] bg-[hsl(253.33,100%,98.24%)]">
                          <SelectValue placeholder="Select a purchase" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPurchases.map((purchase) => (
                            <SelectItem className="text-[hsl(216,32%,17%)]" key={purchase.id} value={purchase.id}>
                              {purchase.id} - {purchase.supplier} - AFN {purchase.unitPrice.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[hsl(216,32%,17%)] mb-1 mt-5 ">Return Quantity</Label>
                      <Input
                        className="text-[hsl(216,32%,17%)] h-10 shadow-none bg-[hsl(253.33,100%,98.24%)]"
                        type="number"
                        min={1}
                        value={newPurchaseReturn.quantity}
                        onChange={(e) => setNewPurchaseReturn({...newPurchaseReturn, quantity: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label className="text-[hsl(216,32%,17%)] mb-1 mt-6">Return Reason</Label>
                      <Textarea
                        className="shadow-none text-[hsl(216,32%,17%)]"
                        value={newPurchaseReturn.reason}
                        onChange={(e) => setNewPurchaseReturn({...newPurchaseReturn, reason: e.target.value})}
                        placeholder="Enter reason for return"
                      />
                    </div>
                    <div className="flex gap-2 ">
                      <Button
                        className="bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))]  text-white rounded-[10px] cursor-pointer"
                        onClick={handlePurchaseReturnSubmit}
                        disabled={!newPurchaseReturn.originalPurchaseId || !newPurchaseReturn.reason || newPurchaseReturn.quantity < 1}
                      >
                        
                        Create Return
                      </Button>
                      <Button className="hover:bg-[hsl(214,20%,94%)]  cursor-pointer border-[hsl(214,20%,88%)] rounded-[10px] text-[hsl(216,32%,17%)] shadow-none" variant="outline" onClick={() => setShowPurchaseReturnDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="  w-73 sm:w-108 md:w-140 lg:w-205 overflow-auto no-scrollbar">
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
                      <TableCell className="font-medium text-[hsl(216,32%,17%)]">{returnItem.id}</TableCell>
                      <TableCell className="text-[hsl(216,32%,17%)]">{returnItem.originalPurchaseId}</TableCell>
                      <TableCell className="text-[hsl(216,32%,17%)]">{returnItem.supplierName}</TableCell>
                      <TableCell className="text-[hsl(216,32%,17%)]">{returnItem.productName}</TableCell>
                      <TableCell className="text-[hsl(216,32%,17%)]">{returnItem.quantity}</TableCell>
                      <TableCell className="text-[hsl(216,32%,17%)]">AFN {returnItem.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="max-w-xs truncate text-[hsl(216,32%,17%)]">{returnItem.reason}</TableCell>
                      <TableCell className="text-[hsl(216,32%,17%)]">{returnItem.returnDate}</TableCell>
                      <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {returnItem.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveReturn('purchase', returnItem.id)}
                                className="rounded-[10px] bg-[hsl(214,20%,97%)]  text-green-600 hover:text-[hsl(216,32%,17%)] border-green-300 hover:bg-green-50"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectReturn('purchase', returnItem.id)}
                                className="rounded-[10px] hover:text-[hsl(216,32%,17%)] bg-[hsl(214,20%,97%)] text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Button className="rounded-[10px] hover:text-black bg-[hsl(214,20%,97%)] border-gray-300 hover:bg-gray-200" size="sm" variant="outline">
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
