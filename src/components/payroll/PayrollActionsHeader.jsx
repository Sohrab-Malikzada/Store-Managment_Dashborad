import { Button } from "@/components/ui/button";
import { CreditCard, Minus, Gift, Plus } from "lucide-react";

export function PayrollActionsHeader({
  onAdvancePayment,
  onAddDeduction,
  onAllocateBonus,
  onProcessPayroll
}) {
  return (
    <div className="flex flex-col lg:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Payroll Management
        </h1>
        <p className="text-[hsl(216,20%,45%)]  mt-1">
          Manage employee salaries, bonuses, and payment processing with advanced controls
        </p>
      </div>
      <div>
        <Button
          variant="outline"
          onClick={onAdvancePayment}
          className="my-4 -mt-6 w-35 text-[12px] shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer hover:text-[hsl(216,32%,17%))]  hover:bg-[hsl(142,76%,45%)]/10  mr-2  rounded-[10px] text-[hsl(142,76%,36%)] bg-[hsl(248,250%,98%)] border-[hsl(142deg,76%,36%,20%)] hover:shadow-medium transition-smooth"
        >
          <CreditCard className="h-4 w-4" />
          Advance Payment
        </Button>

        <Button
          variant="outline"
          onClick={onAddDeduction}
          className="-mt-6 w-30 text-[12px]  shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer hover:text-[hsl(216,32%,17%))]  hover:bg-[hsl(38,92%,50%)]/10  mr-2  rounded-[10px] text-[hsl(38,92%,50%)] bg-[hsl(248,250%,98%)] border-[hsl(38deg,92%,50%,20%)] hover:shadow-medium transition-smooth"
        >
          <Minus className="h-4 w-4" />
          Add Deduction
        </Button>

        <Button
          variant="outline"
          onClick={onAllocateBonus}
          className="-mt-6 w-30 text-[12px] shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer hover:text-[hsl(216,32%,17%))]  hover:bg-[hsl(214,84%,56%)]/10  mr-2  rounded-[10px] text-[hsl(214,84%,56%)] bg-[hsl(248,250%,98%)] border-[hsl(214deg,84%,56%,20%)] hover:shadow-medium transition-smooth"
        >
          <Gift className="h-4 w-4" />
          Allocate Bonus
        </Button>

        <Button
          onClick={onProcessPayroll}
          className="-mt-6  w-30 text-[12px] gradient-primary text-white shadow-soft hover:shadow-medium transition-smooth"
        >
          <Plus className="h-4 w-4" />
          Process Payroll
        </Button>
      </div>

    </div>
  );
}
