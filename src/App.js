import React, { useState, useEffect } from 'react';
import MyWriter from './pages/MyWriter';
import { BooksProvider } from './context/BooksContext';
import { ToastProvider } from './context/ToastContext';
import './styles/style.css';

export default function App() {
  return (
    <ToastProvider>
      <BooksProvider>
        <MyWriter />
      </BooksProvider>
    </ToastProvider>
  );
}
