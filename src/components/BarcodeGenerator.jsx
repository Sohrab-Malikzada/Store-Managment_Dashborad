import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BarcodeGenerator({ isOpen, onClose, productSku, productName }) {
  const canvasRef = useRef(null);
  const svgRef = useRef(null); // این هنوز استفاده نمی‌شود، ولی نگه داشته شده است

  useEffect(() => {
    if (isOpen && productSku && canvasRef.current) {
      try {
        JsBarcode(canvasRef.current, productSku, {
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
    }
  }, [isOpen, productSku]);

  const downloadBarcode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `barcode-${productSku}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const printBarcode = () => {
    if (canvasRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Barcode - ${productName}</title>
              <style>
                body { 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  height: 100vh; 
                  margin: 0; 
                  flex-direction: column;
                  font-family: Arial, sans-serif;
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
              </style>
            </head>
            <body>
              <div class="barcode-container">
                <div class="product-info">
                  <strong>${productName}</strong><br>
                  SKU: ${productSku}
                </div>
                <img src="${canvasRef.current.toDataURL()}" alt="Barcode" />
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gradient-card max-w-md">
        <DialogHeader>
          <DialogTitle className="flex text-[hsl(216,32%,17%)] items-center gap-2">
            Barcode Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-[hsl(216,32%,17%)] text-lg">{productName}</h3>
            <p className="text-[hsl(216,20%,45%)]">SKU: {productSku}</p>
          </div>
          
          <div className="flex justify-center p-4 bg-[hsl(0deg,0%,100%)]  border-[hsl(214,20%,88%)] rounded-[10px] border">
            <canvas 
              ref={canvasRef}
              className="max-w-full"
            />
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              onClick={downloadBarcode}
              className="shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer   rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] border-[hsl(214,20%,88%)] hover:shadow-medium transition-smooth"
            >
              Download PNG
            </Button>
            <Button 
              variant="outline" 
              onClick={printBarcode}
              className="shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] cursor-pointer   rounded-[10px] text-[hsl(216,32%,17%)] bg-[hsl(248,250%,98%)] border-[hsl(214,20%,88%)] hover:shadow-medium transition-smooth"
            >
              Print Barcode
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
