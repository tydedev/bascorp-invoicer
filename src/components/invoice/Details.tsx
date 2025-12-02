// Details.tsx
import { useInvoice } from "@/hooks/useInvoice";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Details = ({ isEstimate }: { isEstimate: boolean }) => {
  const { invoice, updateInvoice } = useInvoice();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dettagli</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isEstimate && (
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">N. fattura</Label>
            <Input
              id="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
              disabled={isEstimate} // Disabilita se è preventivo
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={invoice.date}
            onChange={(e) => updateInvoice({ date: e.target.value })}
          />
        </div>
        <div className="space-y-2 col-span-full">
          <Label htmlFor="jobType">Oggetto</Label>
          <Input
            id="jobType"
            value={invoice.jobType}
            onChange={(e) => updateInvoice({ jobType: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Details;
