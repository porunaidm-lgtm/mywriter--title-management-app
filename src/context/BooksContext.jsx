import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  cleanTitle,
  normalizeForCompare,
  roman,
  baseKey,
} from '../utils/normalize';

const BooksContext = createContext();

export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);

  // ADMIN MODE (delete lock)
  const [isAdmin, setIsAdmin] = useState(false);

  function toggleAdmin() {
    setIsAdmin((v) => !v);
  }

  // ---------------- LOAD ----------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem('books');
      if (saved) setBooks(JSON.parse(saved));
    } catch {
      setBooks([]);
    }
  }, []);

  // ---------------- SAVE ----------------
  useEffect(() => {
    try {
      localStorage.setItem('books', JSON.stringify(books));
    } catch {}
  }, [books]);

  // -------------------------------------------------------
  // PART VALIDATION RULES
  // -------------------------------------------------------
  function validatePartRules(baseTitle, part, currentId = null) {
    if (!part) return { ok: true };

    const allowed = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

    if (!allowed.includes(part)) {
      return { ok: false, msg: 'Part must be Roman (I, II, III … only).' };
    }

    const series = books
      .filter(
        (b) =>
          normalizeForCompare(b.title) === normalizeForCompare(baseTitle) &&
          b.id !== currentId
      )
      .sort((a, b) => (a.part || '').localeCompare(b.part || ''));

    if (series.some((b) => !b.part)) {
      return {
        ok: false,
        msg: 'Base exists — convert it to Part I first.',
      };
    }

    const nums = series
      .filter((b) => b.part)
      .map(
        (b) =>
          ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'].indexOf(
            b.part
          ) + 1
      );

    const max = nums.length ? Math.max(...nums) : 0;

    if (part !== roman(max + 1)) {
      return {
        ok: false,
        msg: `Next allowed Part is: Part ${roman(max + 1)}`,
      };
    }

    return { ok: true };
  }

  // -------------------------------------------------------
  // COMMON TITLE RULES
  // -------------------------------------------------------
  function runTitleValidation(title) {
    if (!title) return { ok: false, msg: 'Title cannot be empty.' };

    if (/\d+$/.test(title)) {
      return { ok: false, msg: 'Title cannot end with numbers.' };
    }

    if (/-\s*\d+$/.test(title)) {
      return {
        ok: false,
        msg: 'Looks like Part — please use proper Part format.',
      };
    }

    if (/(^|[-–—\s])part\b/i.test(title)) {
      return {
        ok: false,
        msg: "Don't write Part in the title — use the Part box instead.",
      };
    }

    return { ok: true };
  }

  // -------------------------------------------------------
  // ADD
  // -------------------------------------------------------
  function addBook(title, part = null) {
    title = cleanTitle(title);

    const titleCheck = runTitleValidation(title);
    if (!titleCheck.ok) return titleCheck;

    const hasSeries = books.some(
      (b) => baseKey(b.title) === baseKey(title) && b.part
    );

    if (hasSeries && !part) {
      return {
        ok: false,
        msg: 'Series already started — enter Part (I, II, III...) instead.',
      };
    }

    if (
      books.some(
        (b) =>
          normalizeForCompare(b.title) === normalizeForCompare(title) &&
          (b.part || null) === (part || null)
      )
    ) {
      return { ok: false, msg: 'This title already exists.' };
    }

    const partCheck = validatePartRules(title, part);
    if (!partCheck.ok) return partCheck;

    setBooks((prev) => [...prev, { id: Date.now(), title, part }]);

    return { ok: true };
  }

  // -------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------
  function updateBook(id, title, part = null) {
    title = cleanTitle(title);

    const titleCheck = runTitleValidation(title);
    if (!titleCheck.ok) return titleCheck;

    const hasSeries = books.some(
      (b) => b.id !== id && baseKey(b.title) === baseKey(title) && b.part
    );

    if (hasSeries && !part) {
      return {
        ok: false,
        msg: 'Series started — this record must stay as a Part.',
      };
    }

    if (
      books.some(
        (b) =>
          b.id !== id &&
          normalizeForCompare(b.title) === normalizeForCompare(title) &&
          (b.part || null) === (part || null)
      )
    ) {
      return { ok: false, msg: 'This title already exists.' };
    }

    const partCheck = validatePartRules(title, part, id);
    if (!partCheck.ok) return partCheck;

    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, title, part } : b))
    );

    return { ok: true };
  }

  // -------------------------------------------------------
  // DELETE  (ADMIN LOCK + reorder series)
  // -------------------------------------------------------
  function deleteBook(id) {
    if (!isAdmin) {
      return { ok: false, msg: 'Delete is locked — Admin only.' };
    }

    setBooks((prev) => {
      const remaining = prev.filter((b) => b.id !== id);

      const result = remaining.map((b) => ({ ...b }));

      const groups = {};

      for (const b of result) {
        const key = baseKey(b.title);
        groups[key] = groups[key] || [];
        groups[key].push(b);
      }

      Object.values(groups).forEach((list) => {
        const parts = list
          .filter((b) => b.part)
          .sort((a, b) => a.part.localeCompare(b.part));

        parts.forEach((b, index) => {
          b.part = roman(index + 1);
        });
      });

      return result;
    });

    return { ok: true };
  }

  return (
    <BooksContext.Provider
      value={{
        books,
        isAdmin,
        toggleAdmin,
        addBook,
        updateBook,
        deleteBook,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  return useContext(BooksContext);
}
