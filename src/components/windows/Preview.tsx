import { useState, useEffect } from "react";
import { RefreshCw, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Logo from "../global/Logo";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Invoice } from "@/types/invoice";
import BascorpDetails from "../invoice/BascorpDetails";
import { generatePDF } from "@/lib/pdf-generator";

const Preview = () => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  // const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    // Recupera lo stato dalla finestra principale via IPC
    window.api.getInvoice().then((invoiceData: Invoice) => {
      setInvoice(invoiceData);
    });
  }, []);

  if (!invoice) return <div>Loading...</div>;

  const handleSavePDF = () => {
    generatePDF(invoice);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-lg font-semibold">Anteprima</h1>
          <div className="space-x-2">
            <Button
              variant={"outline"}
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={24} />
              <span>Aggiorna</span>
            </Button>
            <Button onClick={handleSavePDF}>
              <Save size={24} />
              <span>Salva PDF</span>
            </Button>
          </div>
        </div>

        {/* {pdfUrl && (
          <div className="flex items-center justify-center">
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              className="border border-slate-200"
            ></iframe>
          </div>
        )} */}

        <Card className="rounded-none!">
          <CardContent>
            <div className="flex justify-between items-start">
              <div className="space-y-10">
                <Logo />
                <p className="text-base font-extrabold uppercase">
                  {invoice.isEstimate
                    ? "Preventivo"
                    : `Fattura n. ${invoice.invoiceNumber}`}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Data:</span>{" "}
                  {new Date(invoice.date).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <p className="font-bold mb-2">Cliente</p>

                  <p className="font-semibold">{invoice.clientCompany}</p>

                  <p className="font-semibold">
                    {invoice.clientName} {invoice.clientSurname}
                  </p>
                  {invoice.clientStreet && invoice.clientStreetNumber && (
                    <p>
                      {invoice.clientStreet}, {invoice.clientStreetNumber}
                    </p>
                  )}
                  <p>
                    {invoice.clientPostalCode} {invoice.clientCity}{" "}
                    {invoice.clientProvince && `(${invoice.clientProvince})`}
                  </p>
                  <p>{invoice.clientVAT && `P.IVA: ${invoice.clientVAT}`}</p>
                </p>
              </div>
              <div className="mt-20">
                <BascorpDetails />
              </div>
            </div>
            <div>
              <p className="mt-8 text-sm">
                <span className="font-bold">Oggetto:</span>{" "}
                <span className="font-bold">{invoice.jobType}</span>
              </p>
            </div>
            <div className="mt-8">
              <table className="w-full">
                <thead className="text-sm">
                  <tr className="border-b-2">
                    <th className="text-left py-2 max-w-2.5">N.</th>
                    <th className="text-left py-2">Descrizione</th>
                    <th className="text-right py-2">Q.tà</th>
                    <th className="text-right py-2">Prezzo</th>
                    <th className="text-right py-2">Importo</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="text-left py-4">{index + 1}.</td>
                      <td className="text-left py-4 max-w-[150px] text-xs">
                        {item.description}
                      </td>
                      <td className="text-right py-4 align-text-top">
                        {item.quantity}
                        {item.measure}
                      </td>
                      <td className="text-right py-4 align-text-top">
                        €
                        {item.price.toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-right py-4 align-text-top">
                        €
                        {item.total.toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totali */}
              <div className="flex flex-col items-end justify-end py-8">
                <div className="space-y-2 text-sm w-2xs">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Subtotale</Label>
                    <span>
                      €
                      {invoice.subTotal.toLocaleString("it-IT", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {invoice.taxAmount ? (
                    <div className="flex items-center justify-between">
                      <Label className="font-bold">IVA({invoice.tax}%)</Label>
                      <span>
                        €
                        {invoice.taxAmount.toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold">Totale</Label>
                    <span className="text-lg font-bold">
                      €
                      {invoice.total.toLocaleString("it-IT", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {invoice.taxAmount === 0 && (
                    <p className="font-semibold">
                      Operazione senza applicazione IVA
                    </p>
                  )}
                </div>
              </div>

              {invoice.notes.length >= 0 &&
                invoice.notes.map((note) => (
                  <table key={note.id} className="w-full mb-5">
                    <thead className="text-sm">
                      <tr className="border">
                        <th className="text-left py-2 p-2">{note.title}</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr className="border">
                        <td className="text-left py-2 p-2 space-y-1">
                          {note.content.split("\n").map((line, index) => (
                            <p key={index}>{line}</p>
                          ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Preview;
