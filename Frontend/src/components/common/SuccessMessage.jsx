import { CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';

const SuccessMessage = ({ message, onDismiss, className = '' }) => {
  const [visible, setVisible] = useState(true);

  if (!visible || !message) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 ${className}`}
      role="status"
    >
      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      <button
        type="button"
        onClick={handleDismiss}
        className="flex-shrink-0 text-emerald-500 transition-colors hover:text-emerald-700"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SuccessMessage;
