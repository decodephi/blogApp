import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info", duration = 4000) => {
        const id = ++idCounter;
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg, dur) => addToast(msg, "success", dur),
        error:   (msg, dur) => addToast(msg, "error", dur),
        info:    (msg, dur) => addToast(msg, "info", dur),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastDisplay toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastDisplay({ toasts, removeToast }) {
    const icons = { success: "✓", error: "✕", info: "ℹ" };

    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{icons[t.type]}</span>
                    <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
                    <button
                        onClick={() => removeToast(t.id)}
                        style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "inherit", opacity: 0.6, fontSize: 16, padding: "0 2px"
                        }}
                    >✕</button>
                </div>
            ))}
        </div>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
