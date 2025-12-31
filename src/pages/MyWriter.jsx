import React, { useState } from 'react';
import { useState } from 'react';
import { useBooks } from '../context/BooksContext';

import AddBookForm from '../components/AddBookForm';
import SearchBox from '../components/SearchBox';
import BookList from '../components/BookList';

export default function MyWriter() {
  const { books, isAdmin, toggleAdmin } = useBooks();
  const [search, setSearch] = useState('');

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>MyWriter</h1>
      <h3>
        Add + Edit + Delete + Search + LocalStorage + Context + Toast +
        Validation
      </h3>

      {/* 🔐 ADMIN TOGGLE */}
      <button onClick={toggleAdmin} style={{ marginBottom: 10 }}>
        {isAdmin ? 'Admin: ON (Delete enabled)' : 'Admin: OFF (Delete locked)'}
      </button>

      <AddBookForm />

      <SearchBox search={search} setSearch={setSearch} />

      <BookList books={filtered} />
    </div>
  );
}
