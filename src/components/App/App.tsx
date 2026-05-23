import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { fetchNotes } from "../../services/noteService";
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
        <button className={css.button} onClick={() => setIsModalOpen(true)}>  Create note +</button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {notes.length > 0 && (<NoteList notes={notes} />)}
      {isModalOpen && (<Modal onClose={() => setIsModalOpen(false)}><p>Create form here</p></Modal>)}
    </div>
  );
  
}
  