import { useInvoice } from "@/hooks/useInvoice";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Client = () => {
  const { invoice, updateInvoice } = useInvoice();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cliente</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="col-span-full flex gap-4 justify-between">
          <div className="space-y-2 w-full">
            <Label htmlFor="clientName">Nome</Label>
            <Input
              id="clientName"
              onChange={(e) => updateInvoice({ clientName: e.target.value })}
              value={invoice.clientName}
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="clientSurname">Cognome</Label>
            <Input
              id="clientSurname"
              value={invoice.clientSurname}
              onChange={(e) => updateInvoice({ clientSurname: e.target.value })}
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="clientCompany">Azienda (facoltativo)</Label>
            <Input
              id="clientCompany"
              value={invoice.clientCompany}
              onChange={(e) => updateInvoice({ clientCompany: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2 col-span-3">
          <Label htmlFor="clientStreet">Via</Label>
          <Input
            id="clientStreet"
            value={invoice.clientStreet}
            onChange={(e) => updateInvoice({ clientStreet: e.target.value })}
          />
        </div>
        <div className="space-y-2 col-span-1">
          <Label htmlFor="clientStreetNumber">N. Civico</Label>
          <Input
            id="clientStreetNumber"
            value={invoice.clientStreetNumber}
            onChange={(e) =>
              updateInvoice({ clientStreetNumber: e.target.value })
            }
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="clientPostalCode">CAP</Label>
          <Input
            id="clientPostalCode"
            value={invoice.clientPostalCode}
            onChange={(e) =>
              updateInvoice({ clientPostalCode: e.target.value })
            }
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="clientCity">Città</Label>
          <Input
            id="clientCity"
            value={invoice.clientCity}
            onChange={(e) => updateInvoice({ clientCity: e.target.value })}
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="clientProvince">Provincia</Label>
          <Input
            id="clientProvince"
            value={invoice.clientProvince}
            onChange={(e) => updateInvoice({ clientProvince: e.target.value })}
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="clientPhone">Telefono</Label>
          <Input
            id="clientPhone"
            type="tel"
            value={invoice.clientPhone}
            onChange={(e) => updateInvoice({ clientPhone: e.target.value })}
          />
        </div>
        <div className="space-y-2 col-span-3">
          <Label htmlFor="clientEmail">Email</Label>
          <Input
            id="clientEmail"
            type="email"
            value={invoice.clientEmail}
            onChange={(e) => updateInvoice({ clientEmail: e.target.value })}
          />
        </div>
        <div className="space-y-2 col-span-3">
          <Label htmlFor="clientVAT">P.IVA (facoltativo)</Label>
          <Input
            id="clientVAT"
            value={invoice.clientVAT}
            onChange={(e) => updateInvoice({ clientVAT: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Client;
