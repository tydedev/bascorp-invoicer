// InvoiceForm.tsx
import { useInvoice } from "@/hooks/useInvoice";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Client from "./Client";
import Content from "./Content";
import Details from "./Details";
import Notes from "./Notes";
import Total from "./Total";

const InvoiceForm = () => {
  const { invoice, updateInvoice } = useInvoice();

  const handleChange = (value: string) => {
    updateInvoice({ isEstimate: value === "preventivo" });
  };

  return (
    <div className="py-8 space-y-5">
      <RadioGroup
        value={invoice.isEstimate ? "preventivo" : "fattura"}
        onValueChange={handleChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fattura" id="fattura" />
          <Label htmlFor="fattura">Fattura</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="preventivo" id="preventivo" />
          <Label htmlFor="preventivo">Preventivo</Label>
        </div>
      </RadioGroup>

      <Details isEstimate={invoice.isEstimate || false} />
      <Client />
      <Content />
      <Total />
      <Notes />
    </div>
  );
};

export default InvoiceForm;
