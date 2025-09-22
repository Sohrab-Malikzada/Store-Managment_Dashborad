import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function CSVImport({ onImport }) {
  // این فقط یک دکمه نمایشی است. منطق واقعی import باید اضافه شود.
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
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
