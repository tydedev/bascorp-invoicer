import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { InvoiceItem as TInvoiceItem } from "@/types/invoice";
import { useInvoice } from "@/hooks/useInvoice";
type InvoiceItemProps = {
  item: TInvoiceItem;
  index: number;
  canRemove: boolean;
};

const InvoiceItem = ({ item, index, canRemove }: InvoiceItemProps) => {
  const { removeItem, updateItem } = useInvoice();

  const handleOnBlurQuantity = () => {
    if (item.quantity === "" || Number(item.quantity) < 0) {
      updateItem(index, "quantity", 0);
    }
  };

  const handleOnBlurPrice = () => {
    if (item.price === "" || Number(item.price) < 0) {
      updateItem(index, "price", 0);
    }
  };

  return (
    <>
      <div className="space-y-2 col-span-5">
        <Label htmlFor="itemDescription">Descrizione</Label>
        <Input
          id="itemDescription"
          value={item.description}
          onChange={(e) => updateItem(index, "description", e.target.value)}
        />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="itemQuantity">Q.tà</Label>
        <Input
          id="itemQuantity"
          type="number"
          placeholder="0"
          onBlur={handleOnBlurQuantity}
          value={item.quantity}
          onChange={(e) => updateItem(index, "quantity", e.target.value)}
        />
      </div>
      <div className="space-y-2 col-span-1">
        <Label htmlFor="itemMeasure">Misura</Label>
        <Input
          id="itemMeasure"
          placeholder="mq"
          value={item.measure}
          onChange={(e) => updateItem(index, "measure", e.target.value)}
        />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="itemPrice">Prezzo (€)</Label>
        <Input
          id="itemPrice"
          type="number"
          placeholder="0,00"
          onBlur={handleOnBlurPrice}
          value={item.price}
          onChange={(e) => updateItem(index, "price", e.target.value)}
        />
      </div>
      <div className="space-y-3 col-span-2">
        <Label htmlFor="itemTotal">Totale</Label>
        <p className="text-sm px-3 py-1">
          €
          {item.total.toLocaleString("it-IT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
      <div className="space-y-2">
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => removeItem(index)}
          disabled={!canRemove}
        >
          <Trash size={24} />
        </Button>
      </div>
    </>
  );
};

export default InvoiceItem;
