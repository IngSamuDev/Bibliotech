import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false, 
  isLoading = false,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm shadow-sky-900/10 focus:ring-sky-500',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-900/10 focus:ring-rose-500'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
