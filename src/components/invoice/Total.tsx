import { useInvoice } from "@/hooks/useInvoice";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const Total = () => {
  const { invoice, updateInvoice } = useInvoice();

  const handleTaxRateChange = (value: string) => {
    if (value === "") {
      updateInvoice({ tax: 0 });
    } else {
      const numValue = Number.parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
        updateInvoice({ tax: numValue });
      }
    }
  };

  const handleTaxBlur = () => {
    if (invoice.tax === 0 || isNaN(Number(invoice.tax))) {
      updateInvoice({ tax: 0 });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Totale</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-2 col-span-1 max-w-[200px]">
          <Label htmlFor="vatValue">IVA (facoltativo)</Label>
          <Input
            id="vatValue"
            type="number"
            min={0}
            max={100}
            onChange={(e) => handleTaxRateChange(e.target.value)}
            onBlur={handleTaxBlur}
          />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <Label>Subtotale</Label>
            <span>
              €
              {invoice.subTotal.toLocaleString("it-IT", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          {invoice.tax ? (
            <div className="flex items-center justify-between">
              <Label>IVA ({invoice.tax}%)</Label>
              <span>
                €
                {invoice.taxAmount?.toLocaleString("it-IT", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ) : (
            ""
          )}
          <Separator />
          <div className="flex items-center justify-between">
            <Label className="text-lg">Totale</Label>
            <span className="text-lg">
              €
              {invoice.total.toLocaleString("it-IT", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Total;
