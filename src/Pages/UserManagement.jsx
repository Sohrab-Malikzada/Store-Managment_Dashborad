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
    color: "bg-[hsl(0,84%,60%)]",
    icon: Crown,
    description: "Full system access",
  },
  cashier: {
    name: "Cashier",
    color: "bg-[hsl(214,84%,56%)]",
    icon: UserCheck,
    description: "Sales and customer management",
  },
  pos: {
    name: "Point of Sale",
    color: "bg-[hsl(142,76%,36%)]",
    icon: Shield,
    description: "Sales and inventory access",
  },
  data_entry: {
    name: "Data Entry",
    color: "bg-[hsl(38,92%,50%)]",
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

      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-[hsl(216,20%,45%)]">
            Manage system users, roles, and access permissions
          </p>
        </div>
        < Dialog open={addUserDialog} onOpenChange={setAddUserDialog} >
          <DialogTrigger asChild >
            <Button className="w-20 h-8 text-[11px] ml-auto sm:text-sm sm:w-[123px] sm:h-9 bg-gradient-to-r text-white from-blue-500 to-blue-400 shadow-glow hover:shadow-medium transition-smooth" >
              <Plus className="h-4 w-4 text-white" />
              Add User
            </Button>
          </DialogTrigger>
          < DialogContent className="w-95 sm:w-full lg:h-100 h-auto rounded-[12px] overflow-auto gradient-card" >
            <DialogHeader>
              <DialogTitle className="flex tracking-tight text-[hsl(216,32%,17%)] items-center gap-2" >
                <Users className="h-5 w-5 text-[hsl(214,84%,56%)]" />
                Add New User
              </DialogTitle>
              < DialogDescription className="text-left mt-[-2px]" >
                Create a new user account with specific role and permissions
              </DialogDescription>
            </DialogHeader>
            < form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddUser(formData);
              }
              }
            >
              <div className="grid gap-4 py-[22px]" >
                <div className="space-y-2" >
                  <Label htmlFor="name" className="mb-[12px]  text-[hsl(216,32%,17%)] " >
                    Full Name
                  </Label>
                  < Input
                    name="name"
                    placeholder="Enter full name"
                    required
                    className="bg-[hsl(253.33deg,100%,98.24%)] mb-[11px] shadow-soft  transition-smooth"
                  />
                </div>
                < div className="space-y-2 py-[-10px] -mt-[5px]" >
                  <Label htmlFor="email" className="mb-[12px]  text-[hsl(216,32%,17%)] " >
                    Email Address
                  </Label>
                  < Input
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    required
                    className="bg-[hsl(253.33deg,100%,98.24%)] mb-[11px] shadow-soft  transition-smooth"
                  />
                </div>
                < div className="space-y-2 py-[-10px] -mt-[5px]" >
                  <Label htmlFor="password" className="mb-[12px]  text-[hsl(216,32%,17%)] " >
                    Password
                  </Label>
                  < Input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    required
                    className="bg-[hsl(253.33deg,100%,98.24%)] mb-[11px] shadow-soft  transition-smooth"
                  />
                </div>
                < div className="space-y-2 py-[-10px] -mt-[5px]" >
                  <Label htmlFor="role" className="mb-[12px]  text-[hsl(216,32%,17%)] " >
                    User Role
                  </Label>

                  {/* Select کنترل‌شده */}
                  <Select
                    name="role"
                    value={roleState}
                    onValueChange={(val) => setRoleState(val)}
                    required
                  >
                    <SelectTrigger className="bg-[hsl(253.33deg,100%,98.24%)] mb-[11px] text-[hsl(216,32%,17%)] shadow-soft  transition-smooth" >
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        Object.entries(roleConfigs).map(([role, config]) => (
                          <SelectItem key={role} value={role} >
                            <div className="flex  items-center gap-2" >
                              <config.icon className="h-4 w-4" />
                              {config.name} - {config.description}
                            </div>
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>

                  {/* hidden input تا FormData همیشه role داشته باشد */}
                  <input type="hidden" name="role" value={roleState} />
                </div>
              </div>
              < DialogFooter >
                <Button
                  type="submit"
                  className="mt-[-19px] bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))] text-white  rounded-[10px] cursor-pointer"
                >
                  Create User
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <StatsCard
          title="Total Users"
          value={totalUsers.toString()}
          icon={Users}
          trend={{ value: 12.5, label: "active accounts" }}
          valuechange="mt-[18px]"
          titlechange="mt-[-7px]"
          trendchange="text-[hsl(142,76%,36%)]  -ml-4 mt-[-5px] "
          box={`rounded-[12px] h-[142px] text-red-600 border bg-card text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
          icanchange="-right-4 h-8 w-8 p-2 text-blue-600 bg-blue-100  rounded-[12px] "

        />
        <StatsCard
          title="Active Users"
          value={activeUsers.toString()}
          icon={UserCheck}
          trend={{ value: 95.2, label: "online rate" }}
          valuechange="mt-[18px]"
          titlechange="mt-[-7px]"
          trendchange="text-[hsl(142,76%,36%)]  -ml-4 mt-[-5px] "
          box={`rounded-[12px] h-[142px] text-red-600 border bg-card text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
          icanchange="-right-4 h-8 w-8 p-2 text-green-600 bg-green-100 rounded-[12px] "

        />
        <StatsCard
          title="Administrators"
          value={adminUsers.toString()}
          icon={Crown}
          trend={{ value: 100, label: "security level" }}
          valuechange="mt-[18px]"
          titlechange="mt-[-7px]"
          trendchange="text-[hsl(142,76%,36%)]  -ml-4 mt-[-5px] "
          box={`rounded-[12px] h-[142px] text-red-600 border bg-card text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
          icanchange="-right-4 h-8 w-8 p-2 text-red-600 bg-red-100 rounded-[12px] "

        />
        <StatsCard
          title="System Access"
          value="24/7"
          icon={Shield}
          trend={{ value: 99.9, label: "uptime" }}
          valuechange="mt-[18px]"
          titlechange="mt-[-7px]"
          trendchange="text-[hsl(142,76%,36%)]  -ml-4 mt-[-5px] "
          box={`rounded-[12px] h-[142px] text-red-600 border bg-card text-card-foreground shadow-sm gradient-card shadow-soft hover:shadow-medium transition-all duration-300`}
          icanchange="-right-4 h-8 w-8 p-2 text-yellow-600 bg-yellow-100 rounded-[12px] "

        />
      </div>

      <Card className="gradient-card h-auto rounded-[12px] shadow-medium">
        <CardHeader className="mt-[-1px]">
          <CardTitle className="flex mt-[-3px] items-center gap-2">
            <Users className="h-5 w-5 text-[hsl(214,84%,56%)]" />
            System Users
          </CardTitle>
          <CardDescription className="mt-[-4px] text-[hsl(216,20%,45%)]">
            Manage user accounts, roles, and access permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="w-73 sm:w-108 md:w-137 lg:w-200 overflow-auto no-scrollbar">
          <Table className="mt-[2px]">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="pl-6">Status</TableHead>
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
                  <TableRow key={user.id} className="hover:bg-[hsl(216,20%,95%)]/50 transition-smooth">
                    <TableCell>
                      <div>
                        <div className="font-medium text-[hsl(216,32%,17%)]">{user.name}</div>
                        <div className="text-sm text-[hsl(216,20%,45%)]">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={`${roleConfig.color} text-white`}>
                          <roleConfig.icon className="h-3  w-3 mr-1" />
                          {roleConfig.name}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium text-[hsl(216,32%,17%)]">{activePermissions}/{totalPermissions}</span>
                        <span className="text-[hsl(216,20%,45%)] ml-1">modules</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex p-4 py-4 items-center gap-2">
                        <Switch className="my-[6px]" checked={user.status === "active"} onCheckedChange={() => toggleUserStatus(user.id)} />
                        <Badge variant={user.status === "active" ? "default" : "secondary"} className={user.status === "active" ? "bg-[hsl(142,76%,36%)] hover:bg-[hsl(142,76%,36%)]/80" : "rounded-full text-[hsl(216,32%,17%)] bg-[hsl(214,20%,93%)] hover:bg-[hsl(214,20%,93%)]/80"}>
                          {user.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-[hsl(216,20%,45%)] text-sm">{user.lastLogin}</TableCell>
                    <TableCell className="text-[hsl(216,20%,45%)] text-sm">{user.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditUserDialog(true);
                          }}
                          className="hover:bg-[hsl(38,92%,55%)]/10 hover:text-[hsl(38,92%,55%)] text-[hsl(216,32%,17%)] rounded-[12px]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {/* Settings button now opens settings modal */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openSettingsForUser(user)}
                          className="hover:bg-[hsl(214,84%,56%)]/10 hover:text-[hsl(214,84%,56%)] text-[hsl(216,32%,17%)] rounded-[12px]"
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
        <DialogContent className="w-90 sm:w-full lg:h-100 overflow-auto rounded-[12px] gradient-card">
          <DialogHeader>
            <DialogTitle className="text-left text-[hsl(216,32%,17%)] flex tracking-tight items-center gap-2">
              <Edit className="h-5 w-5 mt-[1px] text-[hsl(38,92%,55%)]" />
              Edit User Permissions
            </DialogTitle>
            <DialogDescription className="text-left mt-[-2px]">Modify user role and specific module permissions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-[hsl(216,32%,17%)] mt-[6px] mb-[-1px]">User Information</Label>
                  <div className="p-3 border border-[hsl(214,20%,88%)] mt-[5px] rounded-[12px] bg-[hsl(210deg,20%,96.04%)]/30">
                    <div className="font-medium text-[hsl(216,32%,17%)]">{selectedUser.name}</div>
                    <div className="text-sm text-[hsl(216,20%,45%)]">{selectedUser.email}</div>
                  </div>
                </div>
                <div className="space-y-3 mt-[25px]">
                  <Label className="mt-[-2px]">Module Permissions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedUser.permissions || {}).map(([module, hasAccess]) => (
                      <div key={module} className="flex items-center justify-between p-2 border border-[hsl(214,20%,88%)] rounded-[4px]">
                        <span className="capitalize text-[hsl(216,32%,17%)] text-sm">{module.replace(/([A-Z])/g, " $1").trim()}</span>
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
          <DialogFooter className="mt-[-6px]">
            <Button className="hover:bg-[hsl(214,20%,94%)]  cursor-pointer border-[hsl(214,20%,88%)] rounded-[10px] text-[hsl(216,32%,17%)] shadow-none"
              variant="outline"
              onClick={() => setEditUserDialog(false)}>Cancel</Button>
            <Button type="submit" className=" bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))]  text-white hover:shadow-medium rounded-[10px] cursor-pointer"
              onClick={() => handleSaveEditedPermissions(selectedUser)}>Save Changes
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog (ویرایش کامل: نام، ایمیل، نقش، وضعیت، مجوزها) */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="w-90 h-164 sm:w-full md:h-auto lg:h-106 overflow-auto rounded-[12px] gradient-card">
          {/* overflow-y-auto */}
          <DialogHeader>
            <DialogTitle className="flex  text-[hsl(216,32%,17%)] items-center gap-2">
              <Settings className="h-5 w-5 text-[hsl(214,84%,56%)]" />
              User Settings
            </DialogTitle>
            <DialogDescription className="text-left">Update user basic settings and module permissions</DialogDescription>
          </DialogHeader>

          {settingsUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-3">
                <Label>Full Name</Label>
                <Input className="bg-[hsl(214,20%,98%)] shadow-none text-[hsl(216,32%,17%)]" placeholder="Enter full name" value={settingsUser.name} onChange={(e) => setSettingsUser({ ...settingsUser, name: e.target.value })} />

                <Label>Email</Label>
                <Input className="bg-[hsl(214,20%,98%)] shadow-none text-[hsl(216,32%,17%)]" placeholder="Enter email address" type="email" value={settingsUser.email} onChange={(e) => setSettingsUser({ ...settingsUser, email: e.target.value })} />

                <Label>User Role</Label>
                <Select className="text-[hsl(216,32%,17%)]" value={settingsUser.role} onValueChange={onSettingsRoleChange}>
                  <SelectTrigger className="text-[hsl(216,32%,17%)]">
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
                  <Label className="mr-[8px]">Status</Label>
                  <Switch checked={settingsUser.status === "active"} onCheckedChange={(v) => setSettingsUser({ ...settingsUser, status: v ? "active" : "inactive" })} />
                </div>

                <div>
                  <Label>Module Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(settingsUser.permissions || {}).map(([module, hasAccess]) => (
                      <div key={module} className="flex items-center justify-between p-2 border border-[hsl(214,20%,88%)] rounded-[4px]">
                        <span className="capitalize text-[hsl(216,32%,17%)] text-sm">{module.replace(/([A-Z])/g, " $1").trim()}</span>
                        <Switch checked={hasAccess} onCheckedChange={() => togglePermissionInSettings(module)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button className="hover:bg-[hsl(214,20%,94%)]  cursor-pointer border-[hsl(214,20%,88%)] rounded-[10px] text-[hsl(216,32%,17%)] shadow-none"
              variant="outline"
              onClick={() => { setSettingsDialogOpen(false); setSettingsUser(null); }}>
              Cancel
            </Button>
            <Button type="submit" className=" bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))]  text-white hover:shadow-medium rounded-[10px] cursor-pointer"
              onClick={saveUserSettings}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
