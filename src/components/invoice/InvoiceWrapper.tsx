import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import InvoiceForm from "./InvoiceForm";
import Logo from "../global/Logo";

const InvoiceWrapper = () => {
  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col p-6">
      <div className="flex items-start justify-between">
        <Logo text={"Invoicer"} />
        <Button
          onClick={() => window.api.openPreview(`Anteprima`)}
          size={"sm"}
          variant={"outline"}
        >
          <Eye size={24} />
          <span>Anteprima</span>
        </Button>
      </div>
      <InvoiceForm />
    </div>
  );
};

export default InvoiceWrapper;
