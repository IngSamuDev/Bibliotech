import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

const ErrorMessage = ({ message, onDismiss, className = '' }) => {
  const [visible, setVisible] = useState(true);

  if (!visible || !message) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 ${className}`}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ErrorMessage;
