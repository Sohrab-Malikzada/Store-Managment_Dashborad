import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BarcodeGenerator({ isOpen, onClose, productSku, productName }) {
  const svgRef = useRef(null);

  // تولید بارکود پس از باز شدن مودال و آماده شدن DOM
  useEffect(() => {
    if (!isOpen) return;

    const id = setTimeout(() => {
      const value = String(productSku || "").trim();
      if (!svgRef.current || value.length === 0) return;

      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          width: 2,
          height: 100,
          displayValue: true,
          background: "#ffffff",
          lineColor: "#000000",
          margin: 10,
          fontSize: 14
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }, 60); // تأخیر کوتاه برای اطمینان از آماده بودن پورتال/DOM

    return () => clearTimeout(id);
  }, [isOpen, productSku]);

  // تبدیل SVG به PNG برای دانلود
  const downloadBarcode = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);

    // ساخت تصویر از SVG
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // کانواس موقت برای تبدیل به PNG
      const canvas = document.createElement("canvas");
      // عرض و ارتفاع مطابق تنظیمات JsBarcode
      const width = svgEl.viewBox?.baseVal?.width || svgEl.getBoundingClientRect().width || 320;
      const height = svgEl.viewBox?.baseVal?.height || svgEl.getBoundingClientRect().height || 140;

      canvas.width = Math.ceil(width);
      canvas.height = Math.ceil(height);

      const ctx = canvas.getContext("2d");
      // پس‌زمینه سفید برای خروجی تمیز
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `barcode-${String(productSku || "").trim() || "product"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // چاپ مستقیم SVG با اطلاعات محصول
  const printBarcode = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Barcode - ${productName || ""}</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
              background: #fff;
            }
            .barcode-container {
              text-align: center;
              padding: 20px;
              border: 1px solid #ccc;
            }
            .product-info {
              margin-bottom: 10px;
              font-size: 14px;
              color: #333;
            }
            svg { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <div class="barcode-container">
            <div class="product-info">
              <strong>${productName || ""}</strong><br/>
              SKU: ${String(productSku || "").trim()}
            </div>
            ${svgString}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="barcode-desc" className="gradient-card max-w-md">
        <DialogHeader>
          <DialogTitle className="flex text-[hsl(216,32%,17%)] items-center gap-2">
            Barcode Generator
          </DialogTitle>
          <DialogDescription id="barcode-desc">
            Generate, download, and print the barcode for the selected product.          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-[hsl(216,32%,17%)] text-lg">{productName}</h3>
            <p className="text-[hsl(216,20%,45%)]">SKU: {productSku}</p>
          </div>

          {/* کانتینر نمایش بارکود */}
          <div className="flex justify-center p-4 bg-[hsl(0deg,0%,100%)] border-[hsl(214,20%,88%)] rounded-[10px] border">
            <svg
              ref={svgRef}
              className="max-w-full h-auto"
              // ابعاد پیشنهادی برای وضوح مناسب چاپ
              width={320}
              height={140}  
              xmlns="http://www.w3.org/2000/svg"
            />
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={downloadBarcode}
              className="shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] border-[hsl(214,20%,88%)] hover:shadow-medium transition-smooth"
            >
              Download PNG
            </Button>
            <Button
              variant="outline"
              onClick={printBarcode}
              className="shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] border-[hsl(214,20%,88%)] hover:shadow-medium transition-smooth"
            >
              Print Barcode
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
