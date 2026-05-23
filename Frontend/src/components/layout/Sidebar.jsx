import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, LogOut, BookMarked, Tags, PenLine, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/libros', icon: BookOpen, label: 'Libros' },
    { to: '/admin/autores', icon: PenLine, label: 'Autores' },
    { to: '/admin/categorias', icon: Tags, label: 'Categorías' },
    { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
  ];

  const bibliotecarioLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/libros', icon: BookOpen, label: 'Libros' },
    { to: '/admin/autores', icon: PenLine, label: 'Autores' },
    { to: '/admin/categorias', icon: Tags, label: 'Categorías' },
  ];

  const links = user?.rol === ROLES.ADMIN ? adminLinks : bibliotecarioLinks;

  return (
    <aside className="flex h-screen w-72 flex-col bg-slate-950 text-white">
      {/* Header */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-950/30">
            <BookMarked className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{user?.nombre}</p>
            <p className="text-xs text-slate-400">{user?.rol}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <Link
          to="/"
          onClick={onClose}
          className="mb-3 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          Página principal
        </Link>
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive(to)
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-rose-500/15 hover:text-rose-100 transition-all"
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
