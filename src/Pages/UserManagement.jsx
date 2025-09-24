import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Toaster } from "@/components/ui/sonner"
import { Users, Shield, Plus, Edit, UserCheck, UserX, Settings, Crown } from "lucide-react";

// mock users array
const mockUsers = [
  {
    id: "USR001",
    name: "John Admin",
    email: "john.admin@company.com",
    password: "admin123",
    role: "admin",
    permissions: {
      dashboard: true,
      sales: true,
      inventory: true,
      employees: true,
      analytics: true,
      payroll: true,
      debts: true,
      purchases: true,
      userManagement: true
    },
    status: "active",
    lastLogin: "2024-01-15 09:30",
    createdAt: "2023-01-01"
  },
  {
    id: "USR002", 
    name: "Sarah Cashier",
    email: "sarah.cashier@company.com",
    password: "cashier123",
    role: "cashier",
    permissions: {
      dashboard: true,
      sales: true,
      inventory: false,
      employees: false,
      analytics: false,
      payroll: false,
      debts: true,
      purchases: false,
      userManagement: false
    },
    status: "active",
    lastLogin: "2024-01-15 08:45",
    createdAt: "2023-03-15"
  },
  {
    id: "USR003",
    name: "Mike POS",
    email: "mike.pos@company.com",
    password: "pos123", 
    role: "pos",
    permissions: {
      dashboard: true,
      sales: true,
      inventory: true,
      employees: false,
      analytics: false,
      payroll: false,
      debts: true,
      purchases: false,
      userManagement: false
    },
    status: "active",
    lastLogin: "2024-01-14 17:20",
    createdAt: "2023-06-20"
  },
  {
    id: "USR004",
    name: "Emily Data Entry",
    email: "emily.data@company.com",
    password: "data123",
    role: "data_entry",
    permissions: {
      dashboard: true,
      sales: false,
      inventory: true,
      employees: false,
      analytics: false,
      payroll: false,
      debts: false,
      purchases: true,
      userManagement: false
    },
    status: "active",
    lastLogin: "2024-01-13 16:30",
    createdAt: "2023-08-10"
  }
];

// Role config
const roleConfigs = {
  admin: {
    name: "Administrator",
    color: "bg-destructive",
    icon: Crown,
    description: "Full system access"
  },
  cashier: {
    name: "Cashier", 
    color: "bg-primary",
    icon: UserCheck,
    description: "Sales and customer management"
  },
  pos: {
    name: "Point of Sale",
    color: "bg-success",
    icon: Shield,
    description: "Sales and inventory access"
  },
  data_entry: {
    name: "Data Entry",
    color: "bg-warning",
    icon: UserX,
    description: "Inventory and purchase data entry"
  }
};

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  const activeUsers = users.filter(u => u.status === "active").length;
  const adminUsers = users.filter(u => u.role === "admin").length;
  const totalUsers = users.length;

  const handleAddUser = (formData) => {
    const role = formData.get("role");
    const newUser = {
      id: `USR${String(users.length + 1).padStart(3, '0')}`,
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: role,
      permissions: getDefaultPermissions(role),
      status: "active",
      lastLogin: "Never",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);
    setAddUserDialog(false);
    toast.success(`Successfully added ${newUser.name} as ${roleConfigs[newUser.role].name}.`);
  };

  const getDefaultPermissions = (role) => {
    switch (role) {
      case "admin":
        return {
          dashboard: true,
          sales: true,
          inventory: true,
          employees: true,
          analytics: true,
          payroll: true,
          debts: true,
          purchases: true,
          userManagement: true
        };
      case "cashier":
        return {
          dashboard: true,
          sales: true,
          inventory: false,
          employees: false,
          analytics: false,
          payroll: false,
          debts: true,
          purchases: false,
          userManagement: false
        };
      case "pos":
        return {
          dashboard: true,
          sales: true,
          inventory: true,
          employees: false,
          analytics: false,
          payroll: false,
          debts: true,
          purchases: false,
          userManagement: false
        };
      case "data_entry":
        return {
          dashboard: true,
          sales: false,
          inventory: true,
          employees: false,
          analytics: false,
          payroll: false,
          debts: false,
          purchases: true,
          userManagement: false
        };
      default:
        return {};
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ));
  };

  return (
    <div className="space-y-6 m-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">User Management</h1>
          <p className="text-muted-foreground">Manage system users, roles, and access permissions</p>
        </div>
        <Dialog open={addUserDialog} onOpenChange={setAddUserDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r text-white from-blue-500 to-blue-400 shadow-soft hover:shadow-medium transition-smooth">
              <Plus className="h-4 w-4 mr-2 text-white" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="gradient-card">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Add New User
              </DialogTitle>
              <DialogDescription>
                Create a new user account with specific role and permissions
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddUser(formData);
            }}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    name="name" 
                    placeholder="Enter full name" 
                    required
                    className="shadow-soft focus:shadow-glow transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="Enter email address" 
                    required
                    className="shadow-soft focus:shadow-glow transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    name="password" 
                    type="password" 
                    placeholder="Enter password" 
                    required
                    className="shadow-soft focus:shadow-glow transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select name="role" required>
                    <SelectTrigger className="shadow-soft focus:shadow-glow transition-smooth">
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfigs).map(([role, config]) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center gap-2">
                            <config.icon className="h-4 w-4" />
                            {config.name} - {config.description}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="gradient-primary shadow-soft hover:shadow-medium">
                  Create User
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={totalUsers.toString()}
          icon={Users}
          trend={{ value: 12.5, label: "active accounts" }}
        />
        <StatsCard
          title="Active Users"
          value={activeUsers.toString()}
          icon={UserCheck}
          trend={{ value: 95.2, label: "online rate" }}
        />
        <StatsCard
          title="Administrators"
          value={adminUsers.toString()}
          icon={Crown}
          trend={{ value: 100, label: "security level" }}
        />
        <StatsCard
          title="System Access"
          value="24/7"
          icon={Shield}
          trend={{ value: 99.9, label: "uptime" }}
        />
      </div>

      <Card className="gradient-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            System Users
          </CardTitle>
          <CardDescription>Manage user accounts, roles, and access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const roleConfig = roleConfigs[user.role];
                const activePermissions = Object.values(user.permissions).filter(Boolean).length;
                const totalPermissions = Object.keys(user.permissions).length;
                
                return (
                  <TableRow key={user.id} className="hover:bg-muted/50 transition-smooth">
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${roleConfig.color} text-white`}>
                        <roleConfig.icon className="h-3 w-3 mr-1" />
                        {roleConfig.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{activePermissions}/{totalPermissions}</span>
                        <span className="text-muted-foreground ml-1">modules</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.status === "active"}
                          onCheckedChange={() => toggleUserStatus(user.id)}
                        />
                        <Badge 
                          variant={user.status === "active" ? "default" : "secondary"}
                          className={user.status === "active" ? "bg-success hover:bg-success/80" : ""}
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.createdAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditUserDialog(true);
                          }}
                          className="hover:bg-primary/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialog} onOpenChange={setEditUserDialog}>
        <DialogContent className="gradient-card max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Edit User Permissions
            </DialogTitle>
            <DialogDescription>
              Modify user role and specific module permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                <div>
                  <Label>User Information</Label>
                  <div className="p-3 border border-border rounded-lg bg-muted/30">
                    <div className="font-medium">{selectedUser.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Module Permissions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedUser.permissions).map(([module, hasAccess]) => (
                      <div key={module} className="flex items-center justify-between p-2 border border-border rounded">
                        <span className="capitalize text-sm">{module.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <Switch checked={hasAccess} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditUserDialog(false)}
            >
              Cancel
            </Button>
            <Button className="gradient-primary shadow-soft hover:shadow-medium">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}