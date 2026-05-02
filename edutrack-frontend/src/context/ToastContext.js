import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

const ICONS = {
    success: <CheckCircle size={18} className="text-emerald-500" />,
    error:   <XCircle size={18} className="text-rose-500" />,
    warning: <AlertCircle size={18} className="text-amber-500" />,
    info:    <Info size={18} className="text-blue-500" />,
};

const STYLES = {
    success: 'border-emerald-200 bg-emerald-50',
    error:   'border-rose-200 bg-rose-50',
    warning: 'border-amber-200 bg-amber-50',
    info:    'border-blue-200 bg-blue-50',
};

const TEXT_STYLES = {
    success: 'text-emerald-800',
    error:   'text-rose-800',
    warning: 'text-amber-800',
    info:    'text-blue-800',
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Shorthand methods
    toast.success = (msg) => toast(msg, 'success');
    toast.error   = (msg) => toast(msg, 'error');
    toast.warning = (msg) => toast(msg, 'warning');
    toast.info    = (msg) => toast(msg, 'info');

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-lg shadow-slate-200 pointer-events-auto
                            min-w-[280px] max-w-[400px] animate-slide-in ${STYLES[t.type]}`}
                        style={{
                            animation: 'slideIn 0.3s ease-out'
                        }}
                    >
                        {ICONS[t.type]}
                        <p className={`text-sm font-bold flex-1 ${TEXT_STYLES[t.type]}`}>{t.message}</p>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-slate-400 hover:text-slate-600 transition-colors ml-2"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(100%); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);