import { useState, useEffect } from 'react';
import { BookOpen, Users, Download, TrendingUp, LibraryBig, Eye, Tags, Activity, Star, Calendar } from 'lucide-react';
import { booksApi } from '../../api/booksApi';
import { usersApi } from '../../api/usersApi';
import { authorsApi, categoriesApi } from '../../api/catalogApi';
import { ratingsApi } from '../../api/ratingsApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const MetricCard = ({ icon: Icon, label, value, color, note }) => (
  <div className={`rounded-xl border border-white/60 bg-gradient-to-br ${color} p-5 text-white shadow-sm`}>
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </div>
    <p className="text-3xl font-semibold">{value}</p>
    <p className="mt-1 text-sm text-white/85">{label}</p>
    {note && <p className="mt-3 text-xs font-medium text-white/70">{note}</p>}
  </div>
);

const BarChart = ({ title, items, color = 'bg-sky-500' }) => {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="line-clamp-1 font-medium text-slate-700">{item.label}</span>
              <span className="font-semibold text-slate-900">{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max((item.value / max) * 100, item.value ? 8 : 0)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Donut = ({ value, label }) => {
  const percent = Math.max(0, Math.min(value, 100));
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Interacción general</h2>
      <div className="mt-6 flex items-center gap-6">
        <div
          className="grid h-32 w-32 place-items-center rounded-full"
          style={{ background: `conic-gradient(#0ea5e9 ${percent}%, #e2e8f0 ${percent}% 100%)` }}
        >
          <div className="grid h-24 w-24 place-items-center rounded-full bg-white">
            <span className="text-2xl font-semibold text-slate-950">{percent}%</span>
          </div>
        </div>
        <p className="max-w-xs text-sm leading-6 text-slate-600">{label}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ books: 0, users: 0, authors: 0, categories: 0, downloads: 0, views: 0 });
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const booksData = await booksApi.getAll();
        const safeBooks = Array.isArray(booksData) ? booksData : [];
        setBooks(safeBooks);
        const bookCount = Array.isArray(booksData) ? booksData.length : 0;
        const downloads = Array.isArray(booksData) ? booksData.reduce((sum, book) => sum + Number(book.descargas || 0), 0) : 0;
        const views = Array.isArray(booksData) ? booksData.reduce((sum, book) => sum + Number(book.lecturas || 0), 0) : 0;
        const [authorsData, categoriesData] = await Promise.all([authorsApi.getAll(), categoriesApi.getAll()]);

        let userCount = 0;
        if (user?.rol === ROLES.ADMIN) {
          const usersData = await usersApi.getAll();
          const safeUsers = Array.isArray(usersData) ? usersData : [];
          setUsers(safeUsers);
          userCount = safeUsers.length;
        }

        let ratingsData = [];
        try {
          const res = await ratingsApi.getAll();
          ratingsData = res.data || [];
        } catch (err) {
          console.error("Error fetching ratings:", err);
        }

        setMetrics({
          books: bookCount,
          users: userCount,
          authors: Array.isArray(authorsData) ? authorsData.length : 0,
          categories: Array.isArray(categoriesData) ? categoriesData.length : 0,
          downloads,
          views
        });
        setRatings(ratingsData);
      } catch {
        // metrics stay at 0
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [user]);

  if (loading) return <LoadingSpinner size="lg" className="py-20" />;

  const topReadBooks = [...books]
    .sort((a, b) => Number(b.lecturas || 0) - Number(a.lecturas || 0))
    .slice(0, 5)
    .map((book) => ({ label: book.titulo_libros, value: Number(book.lecturas || 0) }));

  const topDownloadedBooks = [...books]
    .sort((a, b) => Number(b.descargas || 0) - Number(a.descargas || 0))
    .slice(0, 5)
    .map((book) => ({ label: book.titulo_libros, value: Number(book.descargas || 0) }));

  const categoryMap = books.reduce((acc, book) => {
    book.categorias?.forEach((category) => {
      acc[category.nombre_categorias] = (acc[category.nombre_categorias] || 0) + 1;
    });
    return acc;
  }, {});
  const categoryItems = Object.entries(categoryMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const activeUsers = users.filter((item) => item.estado_usuarios).length;
  const engagement = metrics.books ? Math.round(((metrics.views + metrics.downloads) / Math.max(metrics.books * 5, 1)) * 100) : 0;

  // Calculate average rating per book
  const bookRatingsMap = ratings.reduce((acc, rating) => {
    if (!acc[rating.id_libros]) {
      acc[rating.id_libros] = {
        titulo: rating.titulo_libros,
        sum: 0,
        count: 0
      };
    }
    acc[rating.id_libros].sum += Number(rating.puntuacion_calificaciones || 0);
    acc[rating.id_libros].count += 1;
    return acc;
  }, {});

  const topRatedBooks = Object.entries(bookRatingsMap)
    .map(([id, data]) => ({
      id: Number(id),
      label: data.titulo,
      value: Number((data.sum / data.count).toFixed(1)),
      count: data.count
    }))
    .sort((a, b) => b.value - a.value || b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl bg-gradient-to-r from-slate-950 via-sky-950 to-emerald-900 px-6 py-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-200">Panel Bibliotech</p>
            <h1 className="mt-1 text-2xl font-semibold">Hola, {user?.nombre}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Mira cómo se mueve tu biblioteca: lecturas, descargas, usuarios activos y libros que más despiertan interés.
            </p>
          </div>
          <div className="hidden h-14 w-14 items-center justify-center rounded-xl bg-white/10 sm:flex">
            <LibraryBig className="h-7 w-7 text-sky-200" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={BookOpen} label="Total libros" value={metrics.books} color="from-sky-600 to-blue-700" note="Catálogo activo" />
        {user?.rol === ROLES.ADMIN && (
          <MetricCard icon={Users} label="Usuarios" value={metrics.users} color="from-indigo-600 to-violet-700" note={`${activeUsers} activos`} />
        )}
        <MetricCard icon={Tags} label="Categorías" value={metrics.categories} color="from-amber-500 to-orange-600" note="Géneros disponibles" />
        <MetricCard icon={Download} label="Descargas" value={metrics.downloads} color="from-emerald-600 to-teal-700" note="PDF descargados" />
        <MetricCard icon={Eye} label="Lecturas" value={metrics.views} color="from-rose-500 to-pink-700" note="Aperturas registradas" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <BarChart title="Libros con más lecturas" items={topReadBooks.length ? topReadBooks : [{ label: 'Sin lecturas todavía', value: 0 }]} color="bg-sky-500" />
        <Donut value={engagement} label="Este indicador combina lecturas y descargas frente al tamaño del catálogo. Sirve para ver qué tanto se está usando la biblioteca." />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <BarChart title="Libros más descargados" items={topDownloadedBooks.length ? topDownloadedBooks : [{ label: 'Sin descargas todavía', value: 0 }]} color="bg-emerald-500" />
        <BarChart title="Libros mejor valorados" items={topRatedBooks.length ? topRatedBooks.map(b => ({ label: `${b.label} (${b.count} ${b.count === 1 ? 'opinión' : 'opiniones'})`, value: b.value })) : [{ label: 'Sin calificaciones todavía', value: 0 }]} color="bg-amber-500" />
        <BarChart title="Géneros con más libros" items={categoryItems.length ? categoryItems : [{ label: 'Sin categorías todavía', value: 0 }]} color="bg-violet-500" />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <Activity className="mb-4 h-8 w-8 text-sky-600" />
          <p className="text-sm text-slate-500">Promedio de lecturas por libro</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{metrics.books ? (metrics.views / metrics.books).toFixed(1) : '0.0'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <Download className="mb-4 h-8 w-8 text-emerald-600" />
          <p className="text-sm text-slate-500">Promedio de descargas por libro</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{metrics.books ? (metrics.downloads / metrics.books).toFixed(1) : '0.0'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <TrendingUp className="mb-4 h-8 w-8 text-violet-600" />
          <p className="text-sm text-slate-500">Autores registrados</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{metrics.authors}</p>
        </div>
      </div>

      {/* Reseñas y Calificaciones Recientes */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 shadow-sm shadow-amber-500/5">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Reseñas y Calificaciones Recientes</h2>
              <p className="text-xs text-slate-500">Opiniones de los lectores sobre el catálogo</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            {ratings.length} {ratings.length === 1 ? 'reseña' : 'reseñas'}
          </span>
        </div>

        {ratings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 mb-3 border border-slate-100">
              <Star className="h-6 w-6 text-slate-300 stroke-[1.5]" />
            </div>
            <p className="text-sm font-medium text-slate-600">No hay calificaciones registradas aún</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">Las opiniones de tus usuarios y valoraciones de libros aparecerán aquí.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ratings.slice(0, 6).map((rating) => (
              <div
                key={rating.id_calificaciones}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/30 p-5 transition-all duration-300 hover:border-slate-200 hover:bg-slate-50/70 hover:shadow-md hover:shadow-slate-100"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900" title={rating.titulo_libros}>
                        {rating.titulo_libros}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        Por: <span className="font-semibold text-slate-700">{rating.nombre_usuarios}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-100/60 shadow-sm shrink-0">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{rating.puntuacion_calificaciones}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-slate-600 italic bg-white border border-slate-100 rounded-xl p-3 shadow-sm shadow-slate-100/5 group-hover:border-slate-200/60 transition-colors">
                    "{rating.comentario_calificaciones || 'Sin descripción escrita.'}"
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-400">
                  <span className="truncate max-w-[65%]">{rating.email_usuarios}</span>
                  <span className="flex items-center gap-1 shrink-0 font-medium text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(rating.fecha_calificacion_calificaciones).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
