import { initialInvoiceData } from "@/lib/constants";
import { calculateTotals } from "@/lib/utils";
import { Invoice, InvoiceItem, Note } from "@/types/invoice";
import { createContext, useState, useEffect } from "react";

interface TInvoiceContext {
  invoice: Invoice;
  updateInvoice: (updates: Partial<Invoice>) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
  addNote: () => void;
  removeNote: (index: number) => void;
  updateNote: (index: number, field: keyof Note, value: string) => void;
  handleChangeEstimate: () => void;
}

export const InvoiceContext = createContext<TInvoiceContext | null>(null);

function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoiceData);

  // Carica invoice dal Main process quando il componente monta
  useEffect(() => {
    window.api.getInvoice().then((inv: Invoice) => setInvoice(inv));

    // Ascolta eventuali aggiornamenti inviati dal Main process
    window.api.onInvoiceUpdated((updatedInvoice: Invoice) => {
      setInvoice(updatedInvoice);
    });
  }, []);

  const updateInvoice = (updates: Partial<Invoice>) => {
    const newInvoice = { ...invoice, ...updates };

    if (updates.items || updates.tax !== undefined) {
      const items = updates.items ?? invoice.items;
      const taxPercent = updates.tax ?? invoice.tax ?? 0;

      const { subTotal, taxAmount, total } = calculateTotals(
        items,
        taxPercent as number
      );

      newInvoice.subTotal = subTotal;
      newInvoice.tax = taxPercent;
      newInvoice.taxAmount = taxAmount;
      newInvoice.total = total;
    }

    setInvoice(newInvoice);

    // Invia l'aggiornamento al Main process
    window.api.setInvoice(newInvoice);
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 0,
      measure: "",
      price: 0,
      total: 0,
    };

    updateInvoice({ items: [...invoice.items, newItem] });
  };

  const removeItem = (index: number) => {
    if (invoice.items.length > 1) {
      const newItems = invoice.items.filter((_, i) => i !== index);
      updateInvoice({ items: newItems });
    }
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateInvoice({ items: newItems });

    if (field === "quantity" || field === "price") {
      const quantityValue = newItems[index].quantity;
      const priceValue = newItems[index].price;

      const quantity =
        typeof quantityValue === "string"
          ? Number(quantityValue || 0)
          : quantityValue;
      const price =
        typeof priceValue === "string" ? Number(priceValue || 0) : priceValue;

      newItems[index].total = quantity * price;
      updateInvoice({ items: newItems });
    }
  };

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
    };

    updateInvoice({ notes: [...invoice.notes, newNote] });
  };

  const removeNote = (index: number) => {
    const newNotes = invoice.notes.filter((_, i) => i !== index);
    updateInvoice({ notes: newNotes });
  };

  const updateNote = (index: number, field: keyof Note, value: string) => {
    const newNotes = [...invoice.notes];
    newNotes[index] = { ...newNotes[index], [field]: value };
    updateInvoice({ notes: newNotes });
  };

  const handleChangeEstimate = () => {
    updateInvoice({ isEstimate: !invoice.isEstimate });
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoice,
        updateInvoice,
        addItem,
        removeItem,
        updateItem,
        addNote,
        removeNote,
        updateNote,
        handleChangeEstimate,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export default InvoiceProvider;
