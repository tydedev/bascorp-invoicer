import { InvoiceContext } from "@/context/invoice-context";
import { useContext } from "react";

export function useInvoice() {
  const invoiceContext = useContext(InvoiceContext);
  if (!invoiceContext) {
    throw new Error("useInvoice must be used within a InvoiceProvider");
  }
  return invoiceContext;
}
