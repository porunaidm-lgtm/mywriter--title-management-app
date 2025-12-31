import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = 'info') {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI Render */}
      <div style={styles.container}>
        {toasts.map((t) => (
          <div key={t.id} style={{ ...styles.toast, ...styles[t.type] }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const styles = {
  container: {
    position: 'fixed',
    top: 16,
    right: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 9999,
  },

  toast: {
    padding: '10px 14px',
    borderRadius: 6,
    color: 'white',
    minWidth: 200,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontSize: 14,
  },

  success: { background: '#16a34a' },
  error: { background: '#dc2626' },
  info: { background: '#2563eb' },
  warning: { background: '#d97706' },
};

