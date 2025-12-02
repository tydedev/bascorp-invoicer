import { Note as TNote } from "@/types/invoice";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useInvoice } from "@/hooks/useInvoice";

type NoteProps = {
  note: TNote;
  index: number;
};

const NoteItem = ({ note, index }: NoteProps) => {
  const { updateNote, removeNote } = useInvoice();
  return (
    <>
      <div className="space-y-2 col-span-1">
        <Label htmlFor="noteTitle">Titolo</Label>
        <Input
          id="noteTitle"
          value={note.title}
          onChange={(e) => updateNote(index, "title", e.target.value)}
        />
      </div>
      <div className="space-y-2 col-span-1 self-baseline-last">
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => removeNote(index)}
        >
          <Trash size={24} />
        </Button>
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="noteContent">Testo</Label>
        <Textarea
          id="noteContent"
          rows={15}
          value={note.content}
          onChange={(e) => updateNote(index, "content", e.target.value)}
        />
      </div>
    </>
  );
};

export default NoteItem;
