import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
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
            className="flex items-center w-[139px] text-[hsl(216,32%,17%)] gap-4 shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] hover:shadow-medium hover:bg-[hsl(214,20%,95%)] transition-smooth border-[hsl(214,20%,88%)] rounded-[10px] cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[hsl(214,84%,56%)]" />
              Import Products from CSV</DialogTitle>
            <DialogDescription>Upload a CSV file to bulk import products into your inventory</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex  items-center gap-2 rounded-[10px] border-[hsl(214,20%,88%)]"
                onClick={handleChooseFile}
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-[10px] border-[hsl(214,20%,88%)]"
                onClick={handleDownloadTemplate}
              >
                <Download className="h-4 w-4" />
                Download Template
              </Button>

              <div className="ml-3 text-sm text-[hsl(216,20%,45%)]">
                {fileName ? (
                  <div>
                    <div className="font-medium">{fileName}</div>
                    <div className="text-xs">{rowCount} rows</div>
                  </div>
                ) : (
                  <div className="text-xs">No file chosen</div>
                )}
              </div>
            </div>

            {loading && <div className="mt-3 text-sm text-[hsl(216,20%,45%)]">در حال خواندن فایل...</div>}

            {!loading && previewRows && previewRows.length > 0 && (
              <div className="mt-4 border max-w-100 rounded p-3 bg-white shadow-sm">
                <div className="text-sm text-[hsl(216,32%,17%)] mb-2">Preview (first {previewRows.length} rows)</div>
                <div className="overflow-auto max-h-48">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        {headers.map((h, idx) => (
                          <th key={idx} className="text-left pr-4 pb-1 text-xs text-[hsl(216,20%,45%)]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((r, i) => (
                        <tr key={i} className="odd:bg-[hsl(214,20%,98%)]">
                          {headers.map((h, j) => (
                            <td key={j} className="py-1 pr-4">{r[h] ?? r[Object.keys(r)[j]] ?? ""}</td>
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
            <div className="text-sm text-[hsl(216,20%,45%)]">
              {fileName ? `${fileName} • ${rowCount} rows` : "Select a CSV file to import"}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setOpen(false); }}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!rawObjects || rawObjects.length === 0}
                className="bg-[linear-gradient(to_right,hsl(200,100%,40%),hsl(210,100%,65%))] text-white rounded-[10px] disabled:opacity-50"
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
