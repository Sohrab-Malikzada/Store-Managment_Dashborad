import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function CSVImport({ onImport }) {
  // این فقط یک دکمه نمایشی است. منطق واقعی import باید اضافه شود.
  return (
    <Button
      variant="outline"
      className="flex items-center w-[139px] text-[hsl(216,32%,17%)] gap-4 shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] hover:shadow-medium hover:bg-[hsl(214,20%,95%)] transition-smooth border-[hsl(214,20%,88%)] rounded-[10px] cursor-pointer"
      onClick={() => {
        // اینجا می‌توانید منطق انتخاب فایل و import را اضافه کنید
        alert("CSV import is not implemented. Add your logic here.");
        if (onImport) onImport([]);
      }}
    >
      <Upload className="h-4 w-4" />
      Import CSV
    </Button>
  );
}
