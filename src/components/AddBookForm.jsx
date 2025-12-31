import React, { useState } from 'react';
import { useBooks } from '../context/BooksContext';
import { useToast } from '../context/ToastContext';

export default function AddBookForm() {
  const { addBook } = useBooks();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [part, setPart] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = addBook(title, part || null);

    if (!result.ok) {
      showToast(result.msg, 'error');
      return;
    }

    showToast('Book added successfully', 'success');

    setTitle('');
    setPart('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter book title"
      />

      <input
        value={part}
        onChange={(e) => setPart(e.target.value)}
        placeholder="Optional — Part I / Part II"
        style={{ marginLeft: 8 }}
      />

      <button type="submit" style={{ marginLeft: 8 }}>
        Add
      </button>
    </form>
  );
}
