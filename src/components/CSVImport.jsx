import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Car } from "lucide-react";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Toaster, toast } from "react-hot-toast";

/* ساده و سبک: پارسر CSV که از نقل قول‌ها و کاما پشتیبانی می‌کند */
function parseCsvText(csvText) {
  const rows = [];
  let cur = "";
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    const next = csvText[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      row.push(cur);
      cur = "";
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      row.push(cur);
      cur = "";
      rows.push(row);
      row = [];
      if (ch === "\r" && next === "\n") i++;
      continue;
    }

    cur += ch;
  }

  if (cur !== "" || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }

  if (rows.length === 0) return { headers: [], rows: [] };
  const headers = rows[0].map((h) => (h || "").trim());
  const dataRows = rows.slice(1).map((r) => r.map((c) => (c || "").trim()));
  return { headers, rows: dataRows };
}

function rowsToObjects(headers, rows) {
  return rows.map((r) => {
    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i] || `col${i}`] = r[i] ?? "";
    }
    return obj;
  });
}

export function CSVImport({ onImport }) {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [rawObjects, setRawObjects] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChooseFile = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setHeaders([]);
    setPreviewRows([]);
    setRawObjects(null);
    setRowCount(0);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("لطفاً یک فایل CSV انتخاب کنید.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result);
        const parsed = parseCsvText(text);
        const objs = rowsToObjects(parsed.headers, parsed.rows);
        setHeaders(parsed.headers);
        setRawObjects(objs);
        setRowCount(objs.length);
        setPreviewRows(objs.slice(0, 6));
        toast.success(`فایل خوانده شد — ${objs.length} ردیف آمادهٔ واردسازی`);
      } catch (err) {
        console.error("CSV parse error", err);
        toast.error("خطا در خواندن فایل CSV");
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = (err) => {
      console.error("File read error", err);
      toast.error("خطا در خواندن فایل");
      setLoading(false);
    };
    reader.readAsText(file, "utf-8");
  };

  const handleDownloadTemplate = () => {
    const templateHeaders = [
      "name",
      "sku",
      "supplier",
      "category",
      "stockLevel",
      "minStock",
      "purchasePrice",
      "salePrice",
      "status",
    ];
    const csv = templateHeaders.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  const handleImport = () => {
    if (!rawObjects || rawObjects.length === 0) {
      toast.error("هیچ داده‌ای برای واردسازی وجود ندارد");
      return;
    }

    const normalized = rawObjects.map((r) => ({
      name: r.name || r.Name || r.productName || "",
      sku: r.sku || r.SKU || "",
      supplier: r.supplier || "",
      category: r.category || "Uncategorized",
      stockLevel: Number(r.stockLevel || r.stock || 0),
      minStock: Number(r.minStock || r.min || 0),
      purchasePrice: Number(r.purchasePrice || r.cost || 0),
      salePrice: Number(r.salePrice || r.price || 0),
      status: r.status || "In Stock",
      _raw: r,
    }));

    try {
      if (onImport) onImport(normalized);
      toast.success(`${normalized.length} محصول آمادهٔ واردسازی شد`);
      // reset modal state
      setFileName("");
      setHeaders([]);
      setPreviewRows([]);
      setRawObjects(null);
      setRowCount(0);
      if (fileRef.current) fileRef.current.value = "";
      setOpen(false);
    } catch (err) {
      console.error("onImport callback error", err);
      toast.error("خطا در پردازش داده‌ها");
    }
  };

  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center w-28 sm:w-[125px] md:w-[130px] text-[hsl(216,32%,17%)] gap-2 sm:gap-4 shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] hover:shadow-medium hover:bg-[hsl(214,20%,95%)] transition-smooth border-[hsl(214,20%,88%)] rounded-[10px] cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-120 sm:max-w-120 lg:max-w-4xl  rounded-[12px] bg-[rgb(252,252,253)]">
          <DialogHeader>
            <DialogTitle className="text-[hsl(216,32%,17%)] flex items-center gap-2">
            <FileText className="h-5 w-5 text-[hsl(214,84%,56%)]" />
              Import Products from CSV</DialogTitle>
            <DialogDescription>Upload a CSV file to bulk import products into your inventory</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <label className="text-[14px] font-semibold text-[hsl(216,32%,17%)]" htmlFor="">Select CSV File</label>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="grid grid-cols-1 lg:flex lg:flex-row items-center gap-3">
              <Button
                variant="outline"
                className="focus:shadow-glow lg:w-148 cursor-pointer overflow-x-auto no-scrollbar text-sm  h-10 items-center   bg-[hsl(248,250%,98%)] shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] text-[hsl(216,32%,17%)]   gap-2 rounded-[10px] border-[hsl(214,20%,88%)]"
                onClick={handleChooseFile}
              >
                <Upload className="h-4 w-4" />
                Choose File
                <div className=" font-stretch-semi text-[hsl(216,32%,30%)]">
                {fileName ? (
                  <div>
                    <div className="flex font-sans">{fileName}</div>
                  </div>
                ) : (
                      <div className="flex font-sans">No file chosen</div>
                )}
              </div>
              </Button>

              <Button
                variant="outline"
                className="hover:bg-[hsl(248,250%,96%)]  lg:w-60 hover:shadow-medium  cursor-pointer flex  text-sm  h-10 pr-110 bg-[hsl(248,250%,98%)] shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] text-[hsl(216,32%,17%)]  items-center gap-4 rounded-[10px] border-[hsl(214,20%,88%)]"
                onClick={handleDownloadTemplate}
              >
                <Download className="h-4 w-4" />
                Download Template
              </Button>

            </div>

            {loading && <div className="mt-3 text-sm text-[hsl(216,20%,45%)]">در حال خواندن فایل...</div>}

            {!loading && previewRows && previewRows.length > 0 && (
              <div className="mt-4 border h-auto overflow-y-auto no-scrollbar max-w-107 lg:max-w-211 border-[hsl(214,20%,88%)] rounded p-6 bg-[rgb(252,253,253)] shadow-sm">
                <div className="text-lg font-semibold text-[hsl(216,32%,17%)] mb-2">Preview Data</div>
                <div className="overflow-auto no-scrollbar max-h-48">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        {headers.map((h, idx) => (
                          <th key={idx} className="text-left pr-4 pb-4 pt-4  text-[16px] font-semibold  border-b-1  border-b-[hsl(214,20%,85%)] text-[hsl(216,20%,45%)]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((r, i) => (
                        <tr key={i} className="bg-[rgb(252,253,253)]  text-[hsl(216,32%,17%)]">
                          {headers.map((h, j) => (
                            <td key={j} className="py-1 pb-4 pt-4 pr-4">{r[h] ?? r[Object.keys(r)[j]] ?? ""}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex items-center justify-between">
           

            <div className="flex -mr-47 sm:mr-0  gap-2">
              <Button 
                className="border cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] hover:bg-[hsl(248,250%,96%)] border-[hsl(214,20%,88%)] hover:shadow-medium transition-smooth"
               variant="ghost" onClick={() => { setOpen(false); }}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!rawObjects || rawObjects.length === 0}
                className="shadow-[0_10px_7px_-10px_hsl(214,80%,70%)] hover:shadow-[0_10px_13px_-10px_hsl(214,80%,60%)]  bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))] text-white rounded-[10px] disabled:opacity-50"
              >
                Import Products ({rowCount})
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
