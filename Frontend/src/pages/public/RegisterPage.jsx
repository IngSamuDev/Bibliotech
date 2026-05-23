import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleRegister = async (nombre, email, password) => {
    setIsLoading(true);
    try {
      await register(nombre, email, password);
      showSuccess('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      showError(err?.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative blurred background blobs */}
      <div className="absolute top-[-25%] left-[-25%] w-[600px] h-[600px] rounded-full bg-sky-200/35 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-25%] w-[600px] h-[600px] rounded-full bg-indigo-200/35 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center mb-4 shadow-xl shadow-slate-950/15 hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-7 h-7 text-sky-300" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Crear cuenta</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Únete a la biblioteca digital</p>
        </div>

        {/* Card with Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-slate-100/50 border border-white/60">
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
          
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">O</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <a
            href="/api/auth/google"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-[0.98] transition-all duration-200 animate-[fadeIn_0.5s_ease-out]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </a>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6 font-medium">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-sky-600 font-bold hover:text-sky-700 transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
