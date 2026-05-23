import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
const instance = axios.create({
    baseURL: BASE_URL, headers: { Authorization: `Bearer ${TOKEN}`, },
});

export interface FetchNotesResponse { notes: Note[]; totalPages: number; }
interface FetchNotesParams {
    page: number;
    search: string;
    perPage?: number;
}

export async function fetchNotes({ page, search, perPage = 12 }: FetchNotesParams): Promise<FetchNotesResponse> {
    const response = await instance.get<FetchNotesResponse>("/notes", {
        params: { page, perPage, search, },
    });
    return response.data;
}
interface CreateNoteParams {
    title: string;
    content: string;
    tag: NoteTag;
}


export async function createNote(noteData: CreateNoteParams): Promise<Note> {
    const response = await axios.post<Note>(
        `${BASE_URL}/notes`, noteData,
        { headers: { Authorization: `Bearer ${TOKEN}`, }, });
    return response.data;
}

export async function deleteNote( id: string ): Promise<Note> {
    const response = await instance.delete<Note>(`/notes/${id}`);
    return response.data;
}