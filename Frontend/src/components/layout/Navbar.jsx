import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, Menu, X, Home, Library } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 shadow-lg shadow-slate-300">
              <BookOpen className="w-5 h-5 text-sky-300" aria-hidden="true" />
            </span>
            <span>Bibliotech</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex flex-1 items-center justify-between ml-8">
            {/* Left side: Nav Links */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/') ? 'bg-slate-950 text-white shadow-md shadow-slate-950/15' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Home className="h-4 w-4" />
                Inicio
              </Link>
              <Link
                to="/#catalog"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-950"
              >
                <Library className="h-4 w-4" />
                Catálogo
              </Link>
              {isAuthenticated && (user?.rol === ROLES.ADMIN || user?.rol === ROLES.BIBLIOTECARIO) && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-100/80 shadow-sm shadow-sky-500/5'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-500" />
                  Panel Admin
                </Link>
              )}
            </div>

            {/* Right side: Actions / Profile */}
            <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive('/login')
                        ? 'bg-sky-50 text-sky-700 border border-sky-100/80'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-950/15 transition-all duration-200 hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-600/20 hover:scale-[1.02] active:scale-95"
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200/80 px-4 py-1.5 text-sm text-slate-500 shadow-sm select-none">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Hola, <strong className="font-semibold text-slate-800">{user?.nombre}</strong>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-transparent text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all duration-200 active:scale-95"
                  >
                    <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                    Salir
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={(e) => {
                  setMenuOpen(false);
                  if (location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="block px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Inicio
              </Link>
              <Link
                to="/#catalog"
                onClick={(e) => {
                  setMenuOpen(false);
                  if (location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Catálogo
              </Link>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Iniciar Sesión</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg bg-sky-600 text-white text-sm text-center">Registrarse</Link>
            </>
          ) : (
            <>
              <p className="px-4 py-1 text-sm text-slate-500">Hola, <strong>{user?.nombre}</strong></p>
              <Link
                to="/"
                onClick={(e) => {
                  setMenuOpen(false);
                  if (location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="block px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Inicio
              </Link>
              {(user?.rol === ROLES.ADMIN || user?.rol === ROLES.BIBLIOTECARIO) && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Panel Admin</Link>
              )}
              <Link
                to="/#catalog"
                onClick={(e) => {
                  setMenuOpen(false);
                  if (location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Catálogo
              </Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 rounded-lg text-sm text-rose-700 hover:bg-rose-50">Cerrar Sesión</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
