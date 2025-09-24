import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Clock, CheckCircle, XCircle } from "lucide-react";

export function PayrollTable({ payrollRecords, onViewDetails, onEditRecord }) {
  // Only show Paid (green) and Unpaid (red)
  const getStatusLabel = (status) => status === 'paid' ? 'Paid' : 'Unpaid';

  return (
    <div className="border rounded-lg overflow-hidden shadow-soft bg-white dark:bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-semibold">Employee</TableHead>
            <TableHead className="font-semibold">Position</TableHead>
            <TableHead className="font-semibold">Base Salary</TableHead>
            <TableHead className="font-semibold">Bonus</TableHead>
            <TableHead className="font-semibold">Deductions</TableHead>
            <TableHead className="font-semibold">Net Pay</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Payment Date</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrollRecords.map((record) => {
            const isPaid = record.status === 'paid';
            return (
              <TableRow
                key={record.id}
                className={`hover:bg-primary/10 transition-smooth border-b border-muted/30`}
              >
              <TableCell>
                <div>
                  <div className="font-semibold text-foreground text-base">{record.employeeName}</div>
                  <div className="text-xs text-muted-foreground">ID: {record.employeeId}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal px-2 py-1 rounded-full bg-muted/40">
                  {record.position}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-medium text-primary">؋{record.baseSalary.toLocaleString()}</span>
              </TableCell>
              <TableCell>
                {record.bonus > 0 ? (
                  <div className="space-y-1">
                    <span className="text-success font-semibold">+؋{record.bonus.toLocaleString()}</span>
                    {record.bonusReason && (
                      <div className="text-xs text-muted-foreground italic">{record.bonusReason}</div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">؋0</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-warning font-semibold">-؋{record.deductions.toLocaleString()}</span>
                {record.advances.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {record.advances.length} advance(s)
                  </div>
                )}
              </TableCell>
              <TableCell>
                <span className="font-bold text-lg text-foreground">
                  ؋{record.netPay.toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-3 py-1 rounded-full font-semibold text-sm ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(record.paymentDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewDetails?.(record)}
                    className="hover:bg-blue-200 hover:text-blue-400 cursor-pointer transition-smooth rounded"
                  >
                    <Eye className="h-4 w-4 cursor-pointer" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEditRecord?.(record)}
                    className="hover:bg-orange-200 hover:text-orange-400 cursor-pointer transition-smooth rounded"
                  >
                    <Edit className="h-4 w-4 cursor-pointer" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
