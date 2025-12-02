import { Invoice } from "@/types/invoice";

const invoiceLength = 0;

export const initialInvoiceData: Invoice = {
  invoiceNumber: `${invoiceLength + 1}`,
  date: new Date().toISOString().split("T")[0],
  jobType: "",
  clientName: "",
  clientSurname: "",
  clientStreet: "",
  clientStreetNumber: "",
  clientCity: "",
  clientProvince: "",
  clientCountry: "",
  clientCompany: "",
  clientVAT: "",
  clientPostalCode: "",
  clientEmail: "",
  clientPhone: "",
  items: [
    { id: 1, description: "", quantity: 0, measure: "", price: 0, total: 0 },
  ],
  notes: [],
  subTotal: 0,
  total: 0,
  tax: 0,
};
