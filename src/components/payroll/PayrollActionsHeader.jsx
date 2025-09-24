import { Button } from "@/components/ui/button";
import { CreditCard, Minus, Gift, Plus } from "lucide-react";

export function PayrollActionsHeader({ 
  onAdvancePayment, 
  onAddDeduction, 
  onAllocateBonus, 
  onProcessPayroll 
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Payroll Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage employee salaries, bonuses, and payment processing with advanced controls
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button 
          variant="outline" 
          onClick={onAdvancePayment}
          className="shadow-soft hover:shadow-medium transition-smooth text-success border-success/20 hover:bg-success/10"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Advance Payment
        </Button>

        <Button 
          variant="outline" 
          onClick={onAddDeduction}
          className="shadow-soft hover:shadow-medium transition-smooth text-warning border-warning/20 hover:bg-warning/10"
        >
          <Minus className="h-4 w-4 mr-2" />
          Add Deduction
        </Button>

        <Button 
          variant="outline" 
          onClick={onAllocateBonus}
          className="shadow-soft hover:shadow-medium transition-smooth text-primary border-primary/20 hover:bg-primary/10"
        >
          <Gift className="h-4 w-4 mr-2" />
          Allocate Bonus
        </Button>

        <Button 
          onClick={onProcessPayroll}
          className="gradient-primary text-white shadow-soft hover:shadow-medium transition-smooth"
        >
          <Plus className="h-4 w-4 mr-2" />
          Process Payroll
        </Button>
      </div>
    </div>
  );
}
