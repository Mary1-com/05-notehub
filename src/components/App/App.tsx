import { useState } from "react";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NoteForm from "../NoteForm/NoteForm";
import { deleteNote, fetchNotes } from "../../services/noteService";
import css from "../App/App.module.css";
import Modal from "../Modal/Modal";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] =   useState(false);
  const handleSearch = useDebouncedCallback((value: string) => { setSearch(value); setPage(1) }, 500);
  const {data, isLoading, isError} = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, search }),
    placeholderData: (previousData) => previousData,
  });
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteNote, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"], });
    },
  });
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button type="submit" className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {notes.length > 0 && (
        <NoteList notes={notes} onDelete={(id) => deleteMutation.mutate(id)} />
      )}
      {isModalOpen && (<Modal onClose={() => setIsModalOpen(false)}>
        <NoteForm onClose={() => setIsModalOpen(false)}/>
      </Modal>)}
    </div>
  );
} 