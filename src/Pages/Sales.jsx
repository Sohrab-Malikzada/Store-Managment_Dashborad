import { useState } from "react";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Plus, Search, DollarSign, CreditCard, Clock, Trash2, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { mockSales, mockProducts } from "@/data/mockData";
import { StatsCard } from "@/components/StatsCard";
import { SaleDetailsDialog } from "@/components/dialogs/SaleDetailsDialog";

function Sales() {
  const [sales, setSales] = useState(mockSales);
  // const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaymentType, setFilterPaymentType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createCustomerAccount, setCreateCustomerAccount] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [currentProductId, setCurrentProductId] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: "",
    paymentType: "",
    amountPaid: 0,
    dueDate: "",
    guarantorName: "",
    guarantorIdCard: "",
    guarantorAddress: "",
    customerEmail: "",
    customerPassword: "",
    customerPhone: "",
    customerAddress: ""
  });

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = filterPaymentType === "all" || sale.paymentType === filterPaymentType;
    return matchesSearch && matchesPayment;
  });

  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalPaid = sales.reduce((sum, sale) => sum + sale.amountPaid, 0);
  const pendingAmount = sales.reduce((sum, sale) => sum + sale.pendingAmount, 0);
  const installmentSales = sales.filter(sale => sale.paymentType === 'installment').length;

  const getPaymentStatus = (sale) => {
    if (sale.pendingAmount === 0) return { label: "Paid", variant: "success" };
    if (sale.amountPaid === 0) return { label: "Unpaid", variant: "destructive" };
    return { label: "Partial", variant: "warning" };
  };

  const addToCart = () => {
    if (!currentProductId) {
      toast.error("Please select a product");
      return;
    }

    const selectedProduct = mockProducts.find(p => p.id === currentProductId);
    if (!selectedProduct) return;

    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.productId === currentProductId);
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + currentQuantity,
        totalAmount: (updatedItems[existingItemIndex].quantity + currentQuantity) * selectedProduct.salePrice
      };
      setCartItems(updatedItems);
    } else {
      // Add new item to cart
      const newItem = {
        productId: currentProductId,
        productName: selectedProduct.name,
        quantity: currentQuantity,
        unitPrice: selectedProduct.salePrice,
        totalAmount: selectedProduct.salePrice * currentQuantity
      };
      setCartItems([...cartItems, newItem]);
    }

    setCurrentProductId("");
    setCurrentQuantity(1);
    toast.success(`${selectedProduct.name} added to cart`);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedItems = cartItems.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity, totalAmount: item.unitPrice * newQuantity }
        : item
    );
    setCartItems(updatedItems);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalAmount, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer || cartItems.length === 0 || !formData.paymentType) {
      toast.error("Please fill customer name, add products to cart, and select payment method");
      return;
    }

    const totalAmount = cartTotal;
    const amountPaid = formData.paymentType === 'full' ? totalAmount : formData.amountPaid;
    const pendingAmount = totalAmount - amountPaid;

  
    let customerId = undefined;
    // if (createCustomerAccount && formData.customerEmail && formData.customerPassword) {
    //   const newCustomer = {
    //     id: `C${String(customers.length + 1).padStart(3, '0')}`,
    //     name: formData.customer,
    //     email: formData.customerEmail,
    //     password: formData.customerPassword,
    //     phone: formData.customerPhone,
    //     address: formData.customerAddress,
    //     createdDate: new Date().toISOString().split('T')[0]
    //   };
     
    //   setCustomers([...customers, newCustomer]);
    //   customerId = newCustomer.id;
    //   toast.success(`Account created for ${formData.customer}. They can now login at /customer with their credentials.`);
    // }

    const newSale = {
      id: `S${String(sales.length + 1).padStart(3, '0')}`,
      items: [...cartItems],
      totalAmount,
      customer: formData.customer,
      customerId,
      paymentType: formData.paymentType,
      amountPaid,
      pendingAmount,
      saleDate: new Date().toISOString().split('T')[0],
      dueDate: formData.paymentType === 'installment' ? formData.dueDate : undefined,
      guarantor: formData.paymentType === 'installment' && formData.guarantorName ? {
        name: formData.guarantorName,
        idCardNumber: formData.guarantorIdCard,
        address: formData.guarantorAddress
      } : undefined
    };

    setSales([newSale, ...sales]);
    setIsDialogOpen(false);
    setCreateCustomerAccount(false);
    setCartItems([]);
    setCurrentProductId("");
    setCurrentQuantity(1);
    setFormData({
      customer: "",
      paymentType: "",
      amountPaid: 0,
      dueDate: "",
      guarantorName: "",
      guarantorIdCard: "",
      guarantorAddress: "",
      customerEmail: "",
      customerPassword: "",
      customerPhone: "",
      customerAddress: ""
    });

    toast.success(`Sale recorded successfully with ${cartItems.length} product(s)`);
  };

  const handleViewSale = (sale) => {
    setSelectedSale(sale);
    setIsSaleDialogOpen(true);
  };

  const handleSalePaymentUpdate = (saleId, paymentAmount) => {
    setSales(prev => prev.map(sale => 
      sale.id === saleId 
        ? { 
            ...sale, 
            amountPaid: sale.amountPaid + paymentAmount,
            pendingAmount: sale.pendingAmount - paymentAmount
          }
        : sale
    ));
  };

  return (
    <div className="space-y-6 space-x-[-17px] m-6 mx-10 ml-5">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[hsl(216,32%,17%)]">Sales Management</h1>
          <p className="text-[hsl(216,20%,45%)] mt-1">
            Track your sales and payment records
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="-mr-4  w-21 text-[11px] bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))] text-white shadow-[0_10px_20px_-10px_hsl(214,100%,70%)] rounded-[10px] cursor-pointer">
              <Plus className="h-4 w-4" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-full border-[hsl(214,20%,88%)] bg-gray-50 overflow-visible">
            <DialogHeader className="space-y-3 pb-6 border-b border-[hsl(214,20%,88%)]">
              <DialogTitle className="text-2xl font-bold text-[hsl(216,32%,17%)]">Record New Sale</DialogTitle>
              <DialogDescription className="-mt-2 text-base text-[hsl(216,20%,45%)]">
                Enter the details for the new sale transaction and optionally create a customer account.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-8 py-6">
              {/* Customer Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 ">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-[hsl(214,84%,56%)]  rounded-full w-8 h-8 pt-1.5 pl-3 bg-[rgb(228,234,253)]">1</span>
                  </div>
                  <h3 className="text-lg font-semibold  text-[hsl(216,32%,17%)]">Customer Information</h3>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer" className="text-sm font-medium text-[hsl(216,32%,17%)]">Customer Name *</Label>
                    <Input 
                      id="customer" 
                      value={formData.customer}
                      onChange={(e) => setFormData({...formData, customer: e.target.value})}
                      placeholder="Enter customer's full name"
                      className="h-11"
                      required
                    />
                  </div>
                  
                  <div className="flex  items-center space-x-3 p-4 bg-[hsl(0,0%,100%)] rounded-[10px] border border-[hsl(214,20%,88%)]">
                    <Checkbox 
                      id="createAccount" 
                      checked={createCustomerAccount}
                      onCheckedChange={(checked) => setCreateCustomerAccount(!!checked)}
                      className="data-[state=checked]:bg-[hsl(214,84%,56%)] data-[state=checked]:border-[hsl(214,84%,56%)]"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="createAccount" className="text-sm font-medium  text-[hsl(216,32%,17%)] cursor-pointer">
                        Create customer account for online access
                      </Label>
                      <p className="text-xs text-[hsl(216,20%,45%)]">
                        Allow customer to track their purchases and payments online
                      </p>
                    </div>
                  </div>

                  {createCustomerAccount && (
                    <div className="space-y-4 pt-4 border-t border-[hsl(214,20%,88%)]">
                      <h4 className="text-sm font-semibold text-[hsl(216,32%,17%)]">Account Credentials</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerEmail" className="text-sm font-medium text-[hsl(216,32%,17%)]">Email Address *</Label>
                          <Input 
                            id="customerEmail" 
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                            placeholder="customer@email.com"
                            className="h-11 shadow-none"
                            required={createCustomerAccount}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerPassword" className="text-sm font-medium text-[hsl(216,32%,17%)]">Password *</Label>
                          <Input 
                            id="customerPassword" 
                            type="password"
                            value={formData.customerPassword}
                            onChange={(e) => setFormData({...formData, customerPassword: e.target.value})}
                            placeholder="Enter secure password"
                            className="h-11 shadow-none"
                            required={createCustomerAccount}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerPhone" className="text-sm font-medium text-[hsl(216,32%,17%)]">Phone Number</Label>
                          <Input 
                            id="customerPhone" 
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                            placeholder="+93-XXX-XXX-XXX"
                            className="h-11 shadow-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerAddress" className="text-sm font-medium text-[hsl(216,32%,17%)]">Address</Label>
                          <Textarea 
                            id="customerAddress" 
                            value={formData.customerAddress}
                            onChange={(e) => setFormData({...formData, customerAddress: e.target.value})}
                            placeholder="Enter customer address"
                            rows={3}
                            className="resize-none shadow-none "
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Product & Sale Details Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-[hsl(214,84%,56%)]  rounded-full w-8 h-8 pt-1.5 pl-3 bg-[rgb(228,234,253)]">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[hsl(216,32%,17%)]">Product & Sale Details</h3>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6 space-y-6">
                  {/* Add Product to Cart */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product" className="text-sm font-medium text-[hsl(216,32%,17%)]">Select Product *</Label>
                      <Select value={currentProductId} onValueChange={setCurrentProductId}>
                        <SelectTrigger className="line-clamp-1  white-space-nowrap h-11 pl-6  gap-1 text-[hsl(216,32%,17%)]">
                          <SelectValue  placeholder="Choose product to add" />
                        </SelectTrigger>
                        <SelectContent className={"bg-white rounded-[10px] border-[hsl(214,20%,88%)]"}>
                          {mockProducts.map(product => (
                            <SelectItem key={product.id} value={product.id} className="py-3">
                              <div className="flex flex-col">
                                <span className="font-medium text-[hsl(216,32%,17%)]">{product.name}</span>
                                <span className="text-sm text-[hsl(216,20%,45%)]">؋{product.salePrice.toLocaleString()}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-sm font-medium text-[hsl(216,32%,17%)]">Quantity *</Label>
                      <Input 
                        id="quantity" 
                        type="number" 
                        value={currentQuantity}
                        onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
                        min="1"
                        placeholder="1"
                        className="h-11 py-5.5 shadow-none text-[hsl(216,32%,17%)]"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        type="button" 
                        onClick={addToCart}
                        className="h-11 mb-2 py-5.5 w-full bg-[hsl(214,84%,56%)] rounded-[10px]  hover:bg-[hsl(214,84%,60%)] text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>

                  {/* Shopping Cart */}
                  {cartItems.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-[hsl(214,20%,88%)]">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[hsl(216,32%,17%)] flex items-center">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Shopping Cart ({cartItems.length} items)
                        </h4>
                        <span className="text-lg font-bold text-[hsl(216,32%,17%)]">
                          ؋{cartTotal.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between border-[hsl(214,20%,88%)] p-3 bg-[#ffffff] rounded-[12px] border border-border">
                            <div className="flex-1">
                              <span className="font-medium text-[hsl(216,32%,17%)]">{item.productName}</span>
                              <p className="text-sm text-[hsl(216,20%,45%)]">
                                ؋{item.unitPrice.toLocaleString()} × {item.quantity} = ؋{item.totalAmount.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateCartItemQuantity(item.productId, parseInt(e.target.value) || 1)}
                                min="1"
                                className="w-20 h-8 shadow-none bg-[rgb(248,246,255)] text-[hsl(216,32%,17%)]"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFromCart(item.productId)}
                                className="cursor-pointer h-8 w-8 p-0 rounded-[10px]  bg-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/90"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 bg-[hsl(214,84%,56%)]/5 rounded-[12px] border border-[hsl(214,84%,56%)]/20">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[hsl(216,32%,17%)]">Cart Total:</span>
                          <span className="text-xl font-bold text-[hsl(214,84%,56%)]">
                            ؋{cartTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Details Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-[hsl(214,84%,56%)]  rounded-full w-8 h-8 pt-1.5 pl-3 bg-[rgb(228,234,253)]">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[hsl(216,32%,17%)]">Payment Details</h3>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentType" className="text-sm font-medium text-[hsl(216,32%,17%)]">Payment Method *</Label>
                    <Select value={formData.paymentType} onValueChange={(value) => setFormData({...formData, paymentType: value})}>
                      <SelectTrigger className="h-11  text-[hsl(216,32%,17%)]">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full" className="py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">Full Payment</span>
                            <span className="text-sm text-[hsl(216,20%,45%)]">Complete payment now</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="installment" className="py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">Installment/Credit</span>
                            <span className="text-sm text-[hsl(216,20%,45%)]">Partial payment with credit terms</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.paymentType === 'installment' && (
                    <div className="space-y-4 pt-4 border-t  border-[hsl(214,20%,88%)]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"> 
                          <Label htmlFor="amountPaid" className="text-sm font-medium text-[hsl(216,32%,17%)]">Amount Paid Now *</Label>
                          <Input 
                            id="amountPaid" 
                            type="number" 
                            value={formData.amountPaid}
                            onChange={(e) => setFormData({...formData, amountPaid: parseFloat(e.target.value) || 0})}
                            placeholder="0"
                            className="h-11 text-[hsl(216,32%,17%)] shadow-none"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dueDate" className="text-sm font-medium text-[hsl(216,32%,17%)]">Payment Due Date *</Label>
                          <Input 
                            id="dueDate" 
                            type="date" 
                            value={formData.dueDate}
                            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                            className="h-11 shadow-none text-[hsl(216,32%,17%)]"
                            required
                          />
                        </div>
                      </div>
                      
                      {cartItems.length > 0 && formData.amountPaid > 0 && (
                        <div className="p-4 bg-card rounded-lg border border-border">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Total Amount:</span>
                              <span className="font-medium">؋{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Amount Paid:</span>
                              <span className="font-medium text-success">؋{formData.amountPaid.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-border pt-2">
                              <span className="text-muted-foreground">Remaining Balance:</span>
                              <span className="font-bold text-warning">؋{(cartTotal - formData.amountPaid).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>


              {formData.paymentType === 'installment' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center">
                      <span className="text-sm font-semibold text-[hsl(214,84%,56%)]  rounded-full w-8 h-8 pt-1.5 pl-3 bg-[rgb(228,234,253)]">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[hsl(216,32%,17%)]">Guarantor Information</h3>
                      <p className="text-sm text-[hsl(216,20%,45%)]">Optional - for additional security</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guarantorName" className="text-sm font-medium text-[hsl(216,32%,17%)]">Guarantor Full Name</Label>
                        <Input 
                          id="guarantorName" 
                          value={formData.guarantorName}
                          onChange={(e) => setFormData({...formData, guarantorName: e.target.value})}
                          placeholder="Enter guarantor's full name"
                          className="h-11 shadow-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guarantorIdCard" className="text-sm font-medium text-[hsl(216,32%,17%)]">ID Card Number</Label>
                        <Input 
                          id="guarantorIdCard" 
                          value={formData.guarantorIdCard}
                          onChange={(e) => setFormData({...formData, guarantorIdCard: e.target.value})}
                          placeholder="Enter ID card number"
                          className="h-11 shadow-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guarantorAddress" className="text-sm font-medium text-[hsl(216,32%,17%)]">Guarantor Address</Label>
                      <Textarea 
                        id="guarantorAddress" 
                        value={formData.guarantorAddress}
                        onChange={(e) => setFormData({...formData, guarantorAddress: e.target.value})}
                        placeholder="Enter guarantor's complete address"
                        rows={3}
                        className=" resize-none shadow-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="flex-col sm:flex-row gap-5 pt-6 border-t border-[hsl(214,20%,88%)]">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="cursor-pointer border-[hsl(214,20%,88%)] hover:bg-[hsl(214,20%,95%)] shadow-none text-[hsl(216,32%,17%)] rounded-[10px] order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="cursor-pointer gradient-primary rounded-[10px] text-white  shadow-[0_10px_20px_-10px_hsl(214,100%,70%)] order-1 sm:order-2"
                >
                  Record Sale
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard
          className="h-[122px] w-full rounded-[12px]"
          headerClassName="mt-[-22px] ml-[2px]"
          valueClassName="ml-[2px]"
          title="Total Sales"
          value={`؋${totalSales.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
        />
        <StatsCard
          className="h-[122px] w-full rounded-[12px]"
          headerClassName="mt-[-22px] ml-[2px]"
          valueClassName="ml-[2px]"
          title="Amount Received"
          value={`؋${totalPaid.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
        />
        <StatsCard
          className="h-[122px] w-full rounded-[12px]"
          headerClassName="mt-[-22px] ml-[2px]"
          valueClassName="ml-[2px]"
          title="Pending Payments"
          value={`؋${pendingAmount.toLocaleString()}`}
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          className="h-[122px] w-full rounded-[12px]"
          headerClassName="mt-[-22px] ml-[2px]"
          valueClassName="ml-[2px]"
          title="Installment Sales"
          value={installmentSales}
          icon={CreditCard}
          variant="default"
        />
      </div>

      {/* Sales Table */}
      <Card className="grid grid-cols-1 gradient-card h-auto w-full rounded-[12px] border-[hsl(214,20%,88%)]">
        <CardHeader>
          <CardTitle className="text-[hsl(216,32%,17%)]">Sales Records</CardTitle>
          <CardDescription className="text-[hsl(216,20%,45%)] mt-[-4px]">Complete history of all sales transactions</CardDescription>
        </CardHeader>
        <CardContent> 
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="  absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(216,20%,45%)]" />
              <Input
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 py-5 w-full bg-[hsl(248,250%,98%)] shadow-none"
              />
            </div>
            <Select className="w-full  sm:w-48" value={filterPaymentType} onValueChange={setFilterPaymentType}>
              <SelectTrigger className="w-full h-10 py-5 text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] shadow-none  sm:w-48">
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="full">Full Payment</SelectItem>
                <SelectItem value="installment">Installment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto w-full hover:transition-all mt-[25px] duration-300 border border-[hsl(214,20%,88%)] rounded-[10px] text-[hsl(216,20%,45%)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => {
                  const status = getPaymentStatus(sale);
                  return (
                    <TableRow  key={sale.id}>
                      <TableCell className="font-medium text-[hsl(216,32%,17%)]">{sale.id}</TableCell>
                      <TableCell>
                        <div className="font-medium -mr-2 -ml-2 text-[hsl(216,32%,17%)]">{sale.customer}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-[hsl(216,32%,17%)]">
                          {sale.items.map((item, index) => (
                            <div key={index} className="text-sm text-[hsl(216,32%,17%)]">
                              <span className="font-medium -mr-1  text-[hsl(216,32%,17%)]">{item.productName}</span>
                              <span className="text-muted-foreground -mr-1 text-[hsl(216,20%,45%)] ml-2">×{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium  text-[hsl(216,32%,17%)]">؋{sale.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-[hsl(142,76%,36%)]">؋{sale.amountPaid.toLocaleString()}</TableCell>
                      <TableCell className={sale.pendingAmount > 0 ? "text-[hsl(0,84%,60%)]" : "text-[hsl(216,20%,45%)]"}>
                        ؋{sale.pendingAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={sale.paymentType === 'full' ? 'success' : 'warning'}>
                          {sale.paymentType === 'full' ? 'Full Payment' : 'Installment'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[hsl(216,20%,45%)]">{sale.saleDate}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex -ml-2 space-x-2">
                          <Button 
                            className="cursor-pointer hover:bg-[hsl(214,20%,94%)] rounded-[10px] border-[hsl(214,20%,88%)] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)]"
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewSale(sale)}
                          >
                            View
                          </Button>
                          {sale.pendingAmount > 0 && (
                            <Button 
                              className="cursor-pointer hover:bg-[hsl(214,20%,94%)] rounded-[10px] border-[hsl(214,20%,88%)] text-[hsl(214,84%,56%)] hover:text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)]"
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewSale(sale)}
                            >
                              Collect
                            </Button>
                          )}
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

      {/* Sale Details Dialog */}
      <SaleDetailsDialog
        sale={selectedSale}
        isOpen={isSaleDialogOpen}
        onClose={() => setIsSaleDialogOpen(false)}
        onPaymentUpdate={handleSalePaymentUpdate}
      />
    </div>
  );
}
export default Sales;