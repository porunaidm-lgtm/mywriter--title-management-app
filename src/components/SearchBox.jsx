import React, { useState } from 'react';

export default function SearchBox({ search, setSearch }) {
  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search books..."
      style={{ marginBottom: 12 }}
    />
  );
}
