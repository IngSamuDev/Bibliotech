import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  name,
  showPasswordToggle = false
}) => {
  const [visible, setVisible] = useState(false);
  const inputType = showPasswordToggle && type === 'password' && visible ? 'text' : type;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm ${
            showPasswordToggle ? 'pr-11' : ''
          } ${
            error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-sky-500'
          } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-slate-800"
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-rose-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
