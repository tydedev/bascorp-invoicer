export interface Invoice {
  isEstimate?: boolean;
  invoiceNumber: string;
  date: string;
  jobType: string;
  clientName: string;
  clientSurname: string;
  clientStreet: string;
  clientStreetNumber: string;
  clientCity: string;
  clientProvince: string;
  clientCountry: string;
  clientCompany?: string;
  clientVAT?: string;
  clientPostalCode: string;
  clientEmail?: string;
  clientPhone: string;
  items: InvoiceItem[];
  notes: Note[];
  subTotal: number;
  total: number;
  tax?: number | string;
  taxAmount?: number;
}

export interface InvoiceItem {
  id: number | string;
  description: string;
  quantity: number | string;
  measure: string;
  price: number | string;
  total: number;
}

export interface Note {
  id: number | string;
  title: string;
  content: string;
}
