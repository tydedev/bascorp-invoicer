import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useInvoice } from "@/hooks/useInvoice";
import NoteItem from "./NoteItem";

const Notes = () => {
  const { invoice, addNote } = useInvoice();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Note e termini di servizio</CardTitle>
        <CardAction>
          <Button
            size={"sm"}
            variant={"default"}
            className="text-sm"
            onClick={addNote}
          >
            <Plus size={24} />
            <span>Aggiungi</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 items-baseline">
        {invoice.notes.map((note, index) => (
          <NoteItem key={note.id} index={index} note={note} />
        ))}
      </CardContent>
    </Card>
  );
};

export default Notes;
