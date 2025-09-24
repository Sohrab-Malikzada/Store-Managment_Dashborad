import { useState } from "react";
import {
  Plus,
  Search,
  Users,
  DollarSign,
  Calendar,
  CreditCard,
  Eye,
  Edit,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockEmployees } from "@/data/mockData";
import { Toaster } from "@/components/ui/sonner";

export default function Employees() {
  const [employees, setEmployees] = useState(
    mockEmployees.map((emp) => ({ ...emp, isActive: true }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    monthlySalary: 0,
    phoneNumber: "",
    joinDate: "",
  });

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSalary = employees.reduce(
    (sum, emp) => sum + emp.monthlySalary,
    0
  );
  const advancesGiven = employees.reduce(
    (sum, emp) => sum + emp.advanceReceived,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.position || !formData.joinDate) {
      Toaster({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    const newEmployee = {
      id: `E${String(employees.length + 1).padStart(3, "0")}`,
      name: formData.name,
      position: formData.position,
      monthlySalary: formData.monthlySalary,
      advanceReceived: 0,
      pendingSalary: formData.monthlySalary,
      lastPaymentDate: new Date().toISOString().split("T")[0],
      phoneNumber: formData.phoneNumber,
      joinDate: formData.joinDate,
      isActive: true,
    };
    setEmployees([...employees, newEmployee]);
    setIsDialogOpen(false);
    setFormData({
      name: "",
      position: "",
      monthlySalary: 0,
      phoneNumber: "",
      joinDate: "",
    });
    Toaster({
      title: "Success",
      description: "Employee added successfully",
    });
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      position: employee.position,
      monthlySalary: employee.monthlySalary,
      phoneNumber: employee.phoneNumber,
      joinDate: employee.joinDate,
    });
    setEditDialog(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              ...formData,
              pendingSalary: formData.monthlySalary - emp.advanceReceived,
            }
          : emp
      )
    );
    setEditDialog(false);
    setSelectedEmployee(null);
    Toaster({
      title: "Success",
      description: "Employee updated successfully",
    });
  };

  const toggleEmployeeStatus = (employeeId) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, isActive: !emp.isActive } : emp
      )
    );
  };

  const viewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setDetailsDialog(true);
  };

  return (
    <div className="space-y-6 m-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Employee Management
          </h1>
          <p className="text-muted-foreground">
            Manage staff, salaries, and advance payments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white shadow-elegant">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the details for the new employee.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Position
                  </Label>
                  <Input
                    id="position"
                    className="col-span-3"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="monthlySalary" className="text-right">
                    Monthly Salary
                  </Label>
                  <Input
                    id="monthlySalary"
                    type="number"
                    className="col-span-3"
                    value={formData.monthlySalary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthlySalary: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneNumber" className="text-right">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    className="col-span-3"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="joinDate" className="text-right">
                    Join Date
                  </Label>
                  <Input
                    id="joinDate"
                    type="date"
                    className="col-span-3"
                    value={formData.joinDate}
                    onChange={(e) =>
                      setFormData({ ...formData, joinDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="gradient-primary text-white">
                  Add Employee
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value={employees.length.toString()}
          icon={Users}
          trend={{ value: 5.2, label: "from last month" }}
        />
        <StatsCard
          title="Monthly Payroll"
          value={`؋${totalSalary.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 3.1, label: "from last month" }}
        />
        <StatsCard
          title="Advances Given"
          value={`؋${advancesGiven.toLocaleString()}`}
          icon={CreditCard}
          trend={{ value: -12.5, label: "from last month" }}
        />
        <StatsCard
          title="Pending Requests"
          value="3"
          icon={Calendar}
          trend={{ value: 0, label: "from last month" }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Records</CardTitle>
          <CardDescription>
            Manage employee information and salary details
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Monthly Salary</TableHead>
                <TableHead>Advance Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">#{employee.id}</TableCell>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    ؋{employee.monthlySalary.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    ؋{employee.advanceReceived.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleEmployeeStatus(employee.id)}>
                        {employee.isActive ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft
                            className="h-5 w-5"
                            style={{ color: "hsl(216, 20%, 45%)" }}
                          />
                        )}
                      </button>
                      <Badge
                        className={employee.isActive
                          ? "bg-green-100 text-green-700 border-0"
                          : "bg-gray-200 text-gray-600 border-0"}
                      >
                        {employee.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewEmployeeDetails(employee)}
                        className="hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                        className="hover:bg-warning/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Employee Details Dialog */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className="gradient-card max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Employee Details
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Employee ID</Label>
                <p className="text-muted-foreground">#{selectedEmployee.id}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Full Name</Label>
                <p className="font-medium">{selectedEmployee.name}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Position</Label>
                <p className="text-muted-foreground">
                  {selectedEmployee.position}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Monthly Salary</Label>
                <p className="font-medium text-primary">
                  ؋{selectedEmployee.monthlySalary.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Phone Number</Label>
                <p className="text-muted-foreground">
                  {selectedEmployee.phoneNumber}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Join Date</Label>
                <p className="text-muted-foreground">
                  {selectedEmployee.joinDate}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Advance Received</Label>
                <p className="text-yellow-500">
                  ؋{selectedEmployee.advanceReceived.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Pending Salary</Label>
                <p className="text-green-600">
                  ؋{selectedEmployee.pendingSalary.toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="gradient-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Edit Employee
            </DialogTitle>
            <DialogDescription>
              Update employee information and salary details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-position" className="text-right">
                  Position
                </Label>
                <Input
                  id="edit-position"
                  className="col-span-3"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-salary" className="text-right">
                  Monthly Salary
                </Label>
                <Input
                  id="edit-salary"
                  type="number"
                  className="col-span-3"
                  value={formData.monthlySalary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthlySalary: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone Number
                </Label>
                <Input
                  id="edit-phone"
                  className="col-span-3"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-joinDate" className="text-right">
                  Join Date
                </Label>
                <Input
                  id="edit-joinDate"
                  type="date"
                  className="col-span-3"
                  value={formData.joinDate}
                  onChange={(e) =>
                    setFormData({ ...formData, joinDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                Update Employee
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
