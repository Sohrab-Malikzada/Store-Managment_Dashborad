
// Mock data for the business management dashboard

// Mock Products
export const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    stockLevel: 45,
    minStock: 10,
  purchasePrice: 2100,
  salePrice: 3780,
    supplier: 'TechSupply Co.',
    lastRestocked: '2024-01-15'
  },
  {
    id: '2',
    name: 'Smartphone Case',
    sku: 'SC-002',
    category: 'Accessories',
    stockLevel: 8,
    minStock: 15,
  purchasePrice: 420,
  salePrice: 1008,
    supplier: 'Mobile Accessories Ltd.',
    lastRestocked: '2024-01-10'
  },
  {
    id: '3',
    name: 'Bluetooth Speaker',
    sku: 'BS-003',
    category: 'Electronics',
    stockLevel: 22,
    minStock: 5,
  purchasePrice: 1512,
  salePrice: 2940,
    supplier: 'TechSupply Co.',
    lastRestocked: '2024-01-18'
  },
  {
    id: '4',
    name: 'USB Cable',
    sku: 'UC-004',
    category: 'Accessories',
    stockLevel: 150,
    minStock: 25,
  purchasePrice: 168,
  salePrice: 420,
    supplier: 'Cable Experts',
    lastRestocked: '2024-01-20'
  },
  {
    id: '5',
    name: 'Laptop Stand',
    sku: 'LS-005',
    category: 'Office',
    stockLevel: 3,
    minStock: 8,
  purchasePrice: 1260,
  salePrice: 2352,
    supplier: 'Office Solutions',
    lastRestocked: '2024-01-12'
  }
];

// Mock Sales
export const mockSales = [
  {
    id: 'S001',
    items: [
      {
        productId: '1',
        productName: 'Wireless Headphones',
        quantity: 2,
        unitPrice: 3780,
        totalAmount: 7560
      }
    ],
    totalAmount: 7560,
    customer: 'John Smith',
    paymentType: 'full',
    amountPaid: 7560,
    pendingAmount: 0,
    saleDate: '2024-01-22'
  },
  {
    id: 'S002',
    items: [
      {
        productId: '3',
        productName: 'Bluetooth Speaker',
        quantity: 1,
        unitPrice: 2940,
        totalAmount: 2940
      }
    ],
    totalAmount: 2940,
    customer: 'Sarah Johnson',
    paymentType: 'installment',
    amountPaid: 1260,
    pendingAmount: 1680,
    saleDate: '2024-01-21',
    dueDate: '2024-02-21'
  },
  {
    id: 'S003',
    items: [
      {
        productId: '4',
        productName: 'USB Cable',
        quantity: 10,
        unitPrice: 420,
        totalAmount: 4200
      }
    ],
    totalAmount: 4200,
    customer: 'Tech Store',
    paymentType: 'full',
    amountPaid: 4200,
    pendingAmount: 0,
    saleDate: '2024-01-20'
  },
  {
    id: 'S004',
    items: [
      {
        productId: '2',
        productName: 'Smartphone Case',
        quantity: 3,
        unitPrice: 1008,
        totalAmount: 3024
      }
    ],
    totalAmount: 3024,
    customer: 'Mike Davis',
    paymentType: 'installment',
    amountPaid: 1680,
    pendingAmount: 1344,
    saleDate: '2024-01-19',
    dueDate: '2024-02-15'
  }
];

// Mock Purchases
export const mockPurchases = [
  {
    id: 'P001',
    productId: '1',
    productName: 'Wireless Headphones',
    quantity: 50,
    unitPrice: 2100,
    totalAmount: 105000,
    supplier: 'TechSupply Co.',
    amountPaid: 84000,
    pendingAmount: 21000,
    purchaseDate: '2024-01-15',
    dueDate: '2024-02-15'
  },
  {
    id: 'P002',
    productId: '3',
    productName: 'Bluetooth Speaker',
    quantity: 25,
    unitPrice: 1512,
    totalAmount: 37800,
    supplier: 'TechSupply Co.',
    amountPaid: 37800,
    pendingAmount: 0,
    purchaseDate: '2024-01-18'
  }
];

// Mock Employees
export const mockEmployees = [
  {
    id: 'E001',
    name: 'Alice Wilson',
    position: 'Sales Manager',
    monthlySalary: 100800,
    advanceReceived: 25200,
    pendingSalary: 75600,
    lastPaymentDate: '2024-01-01',
    phoneNumber: '+1-555-0101',
    joinDate: '2023-06-15'
  },
  {
    id: 'E002',
    name: 'Bob Martinez',
    position: 'Inventory Clerk',
    monthlySalary: 67200,
    advanceReceived: 0,
    pendingSalary: 67200,
    lastPaymentDate: '2024-01-01',
    phoneNumber: '+1-555-0102',
    joinDate: '2023-09-01'
  },
  {
    id: 'E003',
    name: 'Carol Brown',
    position: 'Customer Service',
    monthlySalary: 75600,
    advanceReceived: 12600,
    pendingSalary: 63000,
    lastPaymentDate: '2024-01-01',
    phoneNumber: '+1-555-0103',
    joinDate: '2023-12-01'
  }
];

// Mock Customer Debts
export const mockCustomerDebts = [
  {
    id: 'CD001',
    customerId: 'C001',
    customerName: 'Sarah Johnson',
    totalDebt: 2940,
    paidAmount: 1260,
    pendingAmount: 1680,
    dueDate: '2024-02-21',
    salesIds: ['S002']
  },
  {
    id: 'CD002',
    customerId: 'C002',
    customerName: 'Mike Davis',
    totalDebt: 3024,
    paidAmount: 1680,
    pendingAmount: 1344,
    dueDate: '2024-02-15',
    salesIds: ['S004']
  }
];

// Mock Customers
export const mockCustomers = [
  {
    id: 'C001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    password: 'password123',
    phone: '+93-700-123-456',
    address: '123 Kabul Street, District 1',
    createdDate: '2024-01-15'
  },
  {
    id: 'C002',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    password: 'password123',
    phone: '+93-700-789-012',
    address: '456 Herat Avenue, District 2',
    createdDate: '2024-01-10'
  }
];

// Mock Supplier Debts
export const mockSupplierDebts = [
  {
    id: 'SD001',
    supplierId: 'SUP001',
    supplierName: 'TechSupply Co.',
    totalDebt: 105000,
    paidAmount: 84000,
    pendingAmount: 21000,
    dueDate: '2024-02-15',
    purchaseIds: ['P001']
  }
];

// Mock System Users
export const mockSystemUsers = [
  {
    id: 'U001',
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    lastLogin: '2024-01-25',
    createdDate: '2023-01-01'
  },
  {
    id: 'U002',
    name: 'Cashier User',
    email: 'cashier@company.com',
    password: 'cashier123',
    role: 'cashier',
    isActive: true,
    lastLogin: '2024-01-24',
    createdDate: '2023-03-15'
  },
  {
    id: 'U003',
    name: 'POS User',
    email: 'pos@company.com',
    password: 'pos123',
    role: 'pos',
    isActive: true,
    lastLogin: '2024-01-23',
    createdDate: '2023-06-10'
  },
  {
    id: 'U004',
    name: 'Data Entry User',
    email: 'dataentry@company.com',
    password: 'data123',
    role: 'data_entry',
    isActive: true,
    lastLogin: '2024-01-22',
    createdDate: '2023-08-20'
  }
];

// Mock Sale Returns
export const mockSaleReturns = [
  {
    id: 'SR001',
    originalSaleId: 'S001',
    customerId: 'C001',
    customerName: 'Sarah Johnson',
    items: [
      {
        productId: '1',
        productName: 'Wireless Headphones',
        quantity: 1,
        unitPrice: 3780,
        totalAmount: 3780
      }
    ],
    totalAmount: 3780,
    reason: 'Defective product',
    returnDate: '2024-01-24',
    status: 'pending'
  },
  {
    id: 'SR002',
    originalSaleId: 'S003',
    customerId: 'C002',
    customerName: 'Tech Store',
    items: [
      {
        productId: '4',
        productName: 'USB Cable',
        quantity: 2,
        unitPrice: 420,
        totalAmount: 840
      }
    ],
    totalAmount: 840,
    reason: 'Customer changed mind',
    returnDate: '2024-01-23',
    status: 'approved',
    processedBy: 'Sales Manager'
  }
];

// Mock Purchase Returns
export const mockPurchaseReturns = [
  {
    id: 'PR001',
    originalPurchaseId: 'P001',
    supplierId: 'SUP001',
    supplierName: 'TechSupply Co.',
    productId: '1',
    productName: 'Wireless Headphones',
    quantity: 5,
    unitPrice: 2100,
    totalAmount: 10500,
    reason: 'Wrong model received',
    returnDate: '2024-01-22',
    status: 'approved',
    processedBy: 'Admin User'
  }
];

// Analytics Data
export const mockMonthlyData = [
  { month: 'Oct', sales: 100800, purchases: 67200, profit: 33600 },
  { month: 'Nov', sales: 126000, purchases: 75600, profit: 50400 },
  { month: 'Dec', sales: 151200, purchases: 92400, profit: 58800 },
  { month: 'Jan', sales: 176400, purchases: 109200, profit: 67200 },
];

// Dashboard Overview Data
export const getDashboardStats = () => {
  const totalProducts = mockProducts.length;
  const lowStockProducts = mockProducts.filter(p => p.stockLevel <= p.minStock).length;
  const totalSales = mockSales.reduce((sum, sale) => sum + sale.amountPaid, 0);
  const pendingCustomerDebts = mockCustomerDebts.reduce((sum, debt) => sum + debt.pendingAmount, 0);
  const pendingSupplierDebts = mockSupplierDebts.reduce((sum, debt) => sum + debt.pendingAmount, 0);
  const totalEmployeeSalaries = mockEmployees.reduce((sum, emp) => sum + emp.pendingSalary, 0);
  
  return {
    totalProducts,
    lowStockProducts,
    totalSales,
    pendingCustomerDebts,
    pendingSupplierDebts,
    totalEmployeeSalaries,
    monthlyProfit: mockMonthlyData[mockMonthlyData.length - 1].profit
  };
};