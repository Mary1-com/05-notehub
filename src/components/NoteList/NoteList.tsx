import type { Note } from "../../types/note";

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    return (
        <ul> {notes.map((note) => (
            <li key={note.id}> {note.title} </li>))}
        </ul>);
}