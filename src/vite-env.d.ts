/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    api: {
      openPreview: (title: string) => void;
      getInvoice: () => Invoice;
      setInvoice: (invoice: Invoice) => void;
      onInvoiceUpdated: (callback: (invoice: Invoice) => void) => void;
    };
  }
}
