import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Clock, CheckCircle, XCircle } from "lucide-react";

export function PayrollTable({ payrollRecords, onViewDetails, onEditRecord }) {
  // Only show Paid (green) and Unpaid (red)
  const getStatusLabel = (status) => status === 'paid' ? 'Paid' : 'Unpaid';

  return (
    <div className="border border-[hsl(214,20%,90%)] rounded-lg overflow-hidden shadow-soft bg-white dark:bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-[hsl(214,20%,95%)]/30 m-40">
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
                className={`hover:bg-[hsl(214,20%,85%)]/10 transition-smooth border-b border-[hsl(214,20%,82%)]/30`}
              >
              <TableCell>
                <div>
                    <div className="font-semibold  text-[hsl(216,32%,17%)] text-md">{record.employeeName}</div>
                    <div className="text-xs text-[hsl(216,20%,45%)]">ID: {record.employeeId}</div>
                </div>
              </TableCell>
              <TableCell>
                  <Badge variant="outline" className="font-normal px-2 py-1 border-none text-[hsl(216,32%,17%)]">
                  {record.position}
                </Badge>
              </TableCell>
              <TableCell>
                  <span className="font-medium text-[hsl(214,84%,56%)]">؋{record.baseSalary.toLocaleString()}</span>
              </TableCell>
              <TableCell>
                {record.bonus > 0 ? (
                  <div className="space-y-1">
                      <span className="text-[hsl(142,76%,36%)] font-semibold">+؋{record.bonus.toLocaleString()}</span>
                    {record.bonusReason && (
                        <div className="text-xs text-[hsl(216,20%,45%)] italic">{record.bonusReason}</div>
                    )}
                  </div>
                ) : (
                      <span className="text-[hsl(216,20%,45%)]">؋0</span>
                )}
              </TableCell>
              <TableCell>
                  <span className="text-[hsl(38,92%,50%)] font-semibold">-؋{record.deductions.toLocaleString()}</span>
                {record.advances.length > 0 && (
                    <div className="text-xs text-[hsl(216,20%,45%)] mt-1">
                    {record.advances.length} advance(s)
                  </div>
                )}
              </TableCell>
              <TableCell>
                  <span className="font-semibold text-lg text-[hsl(216,32%,17%)]">
                  ؋{record.netPay.toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-sm ${isPaid ? 'bg-[hsl(214.15deg,83.93%,56.08%)] hover:bg-[hsl(214.15deg,83.93%,56.08%)]/80 text-white' : 'border border-[hsl(214,20%,88%)] hover:bg-[hsl(214,20%,95%)]/95 text-[hsl(216,32%,17%)]'}`}>
                    {isPaid ? <CheckCircle className="w-4 h-4 flex-shrink-0 text-white" /> : <XCircle className="w-4 h-4 flex-shrink-0 text-red-600" />}
                    {isPaid ? 'Paid' : 'Pending'}
                  </span>

              </TableCell>
                <TableCell className="text-[hsl(216,20%,45%)]">
                {new Date(record.paymentDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewDetails?.(record)}
                      className="hover:bg-[hsl(214,84%,56%)]/10 hover:text-[hsl(214,84%,56%)] cursor-pointer rounded-[12px]"
                  >
                      <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEditRecord?.(record)}
                      className="hover:bg-[hsl(38,92%,50%)]/10 hover:text-[hsl(38,92%,55%)] cursor-pointer rounded-[12px]"
                  >
                      <Edit className="h-4 w-4" />
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
