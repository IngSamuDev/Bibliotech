import { createContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showNotification = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showSuccess = useCallback((message) => showNotification(message, 'success'), [showNotification]);
  const showError = useCallback((message) => showNotification(message, 'error'), [showNotification]);
  const showWarning = useCallback((message) => showNotification(message, 'warning'), [showNotification]);
  const showInfo = useCallback((message) => showNotification(message, 'info'), [showNotification]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />,
    info: <Info className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
  };

  const styles = {
    success: 'bg-white border-emerald-100 text-emerald-900 shadow-emerald-100/50',
    error: 'bg-white border-rose-100 text-rose-900 shadow-rose-100/50',
    warning: 'bg-white border-amber-100 text-amber-900 shadow-amber-100/50',
    info: 'bg-white border-sky-100 text-sky-900 shadow-sky-100/50'
  };

  const progressColors = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500'
  };

  return (
    <NotificationContext.Provider
      value={{ showSuccess, showError, showWarning, showInfo }}
    >
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto relative flex items-start gap-3 p-4 rounded-xl border shadow-lg overflow-hidden animate-toast-in ${styles[toast.type]}`}
            role="alert"
          >
            {icons[toast.type]}
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {toast.type === 'success' ? 'Éxito' : toast.type === 'error' ? 'Error' : toast.type === 'warning' ? 'Advertencia' : 'Información'}
              </p>
              <p className="text-sm font-medium text-slate-800 mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 mt-0.5"
              aria-label="Cerrar"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Time progress bar */}
            {toast.duration > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                <div
                  className={`h-full ${progressColors[toast.type]} rounded-r`}
                  style={{
                    animation: `toast-shrink ${toast.duration}ms linear forwards`
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
