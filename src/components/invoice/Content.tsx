import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import InvoiceItem from "./InvoiceItem";
import { useInvoice } from "@/hooks/useInvoice";

const Content = () => {
  const { invoice, addItem } = useInvoice();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contenuto</CardTitle>
        <CardAction>
          <Button
            size={"sm"}
            variant={"default"}
            className="text-sm"
            onClick={addItem}
          >
            <Plus size={24} />
            <span>Aggiungi</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-13 gap-2 items-baseline-last space-y-3">
        {invoice.items.map((item, index) => (
          <InvoiceItem
            key={item.id}
            index={index}
            item={item}
            canRemove={invoice.items.length > 1}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default Content;
