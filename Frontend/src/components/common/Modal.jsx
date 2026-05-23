import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative z-10 flex max-h-[92vh] w-full ${maxWidth} flex-col rounded-xl border border-white/70 bg-white shadow-2xl shadow-slate-950/20`}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl border-b border-slate-800 bg-slate-950 px-7 py-4 text-white">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
