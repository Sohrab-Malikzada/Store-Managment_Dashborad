import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode } from "lucide-react";

export function BarcodeGenerator({ isOpen, onClose, productSku, productName }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Barcode for {productName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="bg-white p-4 rounded-lg border border-border shadow">
            {/* جایگاه بارکد واقعی */}
            <div className="text-lg font-mono tracking-widest">{productSku}</div>
            <div className="text-xs text-muted-foreground mt-2">(Barcode preview)</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
