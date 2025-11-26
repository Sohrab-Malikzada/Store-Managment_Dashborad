import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Toaster, toast } from "sonner";
import {
  Users,
  Shield,
  Plus,
  Edit,
  UserCheck,
  UserX,
  Settings,
  Crown,
} from "lucide-react";

const roleConfigs = {
  admin: {
    name: "Administrator",
    color: "bg-destructive",
    icon: Crown,
    description: "Full system access",
  },
  cashier: {
    name: "Cashier",
    color: "bg-primary",
    icon: UserCheck,
    description: "Sales and customer management",
  },
  pos: {
    name: "Point of Sale",
    color: "bg-success",
    icon: Shield,
    description: "Sales and inventory access",
  },
  data_entry: {
    name: "Data Entry",
    color: "bg-warning",
    icon: UserX,
    description: "Inventory and purchase data entry",
  },
};

const LOCAL_KEY = "app_users_v1";

function getDefaultPermissions(role) {
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
        userManagement: true,
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
        userManagement: false,
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
        userManagement: false,
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
        userManagement: false,
      };
    default:
      return {};
  }
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleState, setRoleState] = useState("");

  // Settings modal state
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settingsUser, setSettingsUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setUsers(JSON.parse(raw));
      else setUsers([]);
    } catch (err) {
      console.error("Failed to read users from localStorage", err);
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
    } catch (err) {
      console.error("Failed to write users to localStorage", err);
    }
  }, [users]);

  const activeUsers = users.filter((u) => u.status === "active").length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const totalUsers = users.length;

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    );
    toast.success("User status updated");
  };

  const handleAddUser = (formData) => {
    const roleFromForm = formData.get("role");
    const role = roleFromForm || roleState || "cashier";

    const newUser = {
      id: Date.now(),
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role,
      permissions: getDefaultPermissions(role),
      status: "active",
      lastLogin: "Never",
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill all required fields");
      return;
    }

    if (users.some((u) => u.email === newUser.email)) {
      toast.error("A user with this email already exists");
      return;
    }

    setUsers((prev) => [newUser, ...prev]);
    setAddUserDialog(false);
    setRoleState("");
    toast.success(`Successfully added ${newUser.name} as ${roleConfigs[newUser.role]?.name || newUser.role}`);
  };

  // Open settings modal for a user (copy object for safe editing)
  const openSettingsForUser = (user) => {
    setSettingsUser({ ...user });
    setSettingsDialogOpen(true);
  };

  // Save settings (including permissions) back to users state
  const saveUserSettings = () => {
    if (!settingsUser) return;
    if (!settingsUser.name || !settingsUser.email) {
      toast.error("Name and email are required");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === settingsUser.id ? settingsUser : u)));
    setSettingsDialogOpen(false);
    setSettingsUser(null);
    toast.success("User settings saved");
  };

  // When role changes in settings, optionally reset permissions to defaults
  const onSettingsRoleChange = (val) => {
    setSettingsUser((prev) => ({
      ...prev,
      role: val,
      permissions: getDefaultPermissions(val),
    }));
  };

  // Helper to toggle a permission in settingsUser
  const togglePermissionInSettings = (key) => {
    setSettingsUser((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: !prev.permissions[key] },
    }));
  };

  // Save edited permissions from Edit dialog (if used)
  const handleSaveEditedPermissions = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setEditUserDialog(false);
    toast.success("User updated");
  };

  return (
    <div className="space-y-6 m-6">
      <Toaster />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-[hsl(216,20%,45%)]">
            Manage system users, roles, and access permissions (local only)
          </p>
        </div>
        <Dialog open={addUserDialog} onOpenChange={setAddUserDialog}>
          <DialogTrigger asChild>
            <Button className="w-[123px] bg-gradient-to-r text-white from-blue-500 to-blue-400 shadow-glow hover:shadow-medium transition-smooth">
              <Plus className="h-4 w-4 mr-2 text-white" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="gradient-card h-129">
            <DialogHeader>
              <DialogTitle className="flex tracking-tight text-[hsl(216,32%,17%)] items-center gap-2">
                <Users className="h-5 w-5 text-[hsl(214,84%,56%)]" />
                Add New User
              </DialogTitle>
              <DialogDescription className="mt-[-2px]">
                Create a new user account locally (no backend)
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddUser(formData);
              }}
            >
              <div className="grid gap-4 py-[22px]">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input name="name" placeholder="Enter full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input name="email" type="email" placeholder="Enter email address" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input name="password" type="password" placeholder="Enter password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select name="role" value={roleState} onValueChange={(v) => setRoleState(v)} required>
                    <SelectTrigger>
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
                  <input type="hidden" name="role" value={roleState} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Users" value={totalUsers.toString()} icon={Users} />
        <StatsCard title="Active Users" value={activeUsers.toString()} icon={UserCheck} />
        <StatsCard title="Administrators" value={adminUsers.toString()} icon={Crown} />
        <StatsCard title="System Access" value="local" icon={Shield} />
      </div>

      <Card className="gradient-card rounded-[12px] shadow-medium">
        <CardHeader>
          <CardTitle className="flex mt-[-3px] items-center gap-2">
            <Users className="h-5 w-5 text-[hsl(214,84%,56%)]" />
            System Users
          </CardTitle>
          <CardDescription className="mt-[-4px] text-[hsl(216,20%,45%)]">
            Manage user accounts locally
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="mt-[3px]">
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
                const roleConfig = roleConfigs[user.role] || {};
                const permissionsObj = user.permissions || {};
                const activePermissions = Object.values(permissionsObj).filter(Boolean).length;
                const totalPermissions = Object.keys(permissionsObj).length;

                return (
                  <TableRow key={user.id} className="hover:bg-muted/50 transition-smooth">
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={`${roleConfig.color || "bg-muted"} text-white flex items-center gap-1`}>
                          {roleConfig.icon ? <roleConfig.icon className="h-3 w-3 mr-1" /> : null}
                          {roleConfig.name || user.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono px-2 py-0.5 rounded bg-muted/40 w-fit mt-1 border p-4 border-border">
                          {user.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{activePermissions}/{totalPermissions}</span>
                        <span className="text-muted-foreground ml-1">modules</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={user.status === "active"} onCheckedChange={() => toggleUserStatus(user.id)} />
                        <Badge variant={user.status === "active" ? "default" : "secondary"} className={user.status === "active" ? "bg-success hover:bg-success/80" : ""}>
                          {user.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.lastLogin}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.createdAt}</TableCell>
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

                        {/* Settings button now opens settings modal */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openSettingsForUser(user)}
                          className="hover:bg-primary/10"
                        >
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

      {/* Edit User Dialog (permissions quick edit) */}
      <Dialog open={editUserDialog} onOpenChange={setEditUserDialog}>
        <DialogContent className="gradient-card max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Edit User Permissions
            </DialogTitle>
            <DialogDescription>Modify user role and specific module permissions</DialogDescription>
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
                    {Object.entries(selectedUser.permissions || {}).map(([module, hasAccess]) => (
                      <div key={module} className="flex items-center justify-between p-2 border border-border rounded">
                        <span className="capitalize text-sm">{module.replace(/([A-Z])/g, " $1").trim()}</span>
                        <Switch checked={hasAccess} onCheckedChange={(v) => {
                          const updated = { ...selectedUser, permissions: { ...selectedUser.permissions, [module]: v } };
                          setSelectedUser(updated);
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialog(false)}>Cancel</Button>
            <Button onClick={() => handleSaveEditedPermissions(selectedUser)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog (ویرایش کامل: نام، ایمیل، نقش، وضعیت، مجوزها) */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="gradient-card max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              User Settings
            </DialogTitle>
            <DialogDescription>Update user basic settings and module permissions</DialogDescription>
          </DialogHeader>

          {settingsUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-3">
                <Label>Full Name</Label>
                <Input value={settingsUser.name} onChange={(e) => setSettingsUser({ ...settingsUser, name: e.target.value })} />

                <Label>Email</Label>
                <Input type="email" value={settingsUser.email} onChange={(e) => setSettingsUser({ ...settingsUser, email: e.target.value })} />

                <Label>User Role</Label>
                <Select value={settingsUser.role} onValueChange={onSettingsRoleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleConfigs).map(([role, config]) => (
                      <SelectItem key={role} value={role}>
                        <div className="flex items-center gap-2">
                          <config.icon className="h-4 w-4" />
                          {config.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center justify-between">
                  <Label>Status</Label>
                  <Switch checked={settingsUser.status === "active"} onCheckedChange={(v) => setSettingsUser({ ...settingsUser, status: v ? "active" : "inactive" })} />
                </div>

                <div>
                  <Label>Module Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(settingsUser.permissions || {}).map(([module, hasAccess]) => (
                      <div key={module} className="flex items-center justify-between p-2 border border-border rounded">
                        <span className="capitalize text-sm">{module.replace(/([A-Z])/g, " $1").trim()}</span>
                        <Switch checked={hasAccess} onCheckedChange={() => togglePermissionInSettings(module)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setSettingsDialogOpen(false); setSettingsUser(null); }}>
              Cancel
            </Button>
            <Button onClick={saveUserSettings}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
