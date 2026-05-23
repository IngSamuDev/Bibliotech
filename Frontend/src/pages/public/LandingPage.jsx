import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, ChevronDown, ArrowUp, X } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import BookGrid from '../../components/books/BookGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { booksApi } from '../../api/booksApi';
import { categoriesApi } from '../../api/catalogApi';
import { useAuth } from '../../hooks/useAuth';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [categories, setCategories] = useState(['Todos']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch books
    booksApi.getAll()
      .then((data) => {
        setBooks(data);
        setFiltered(data);
      })
      .catch(() => setError('Error al cargar los libros'))
      .finally(() => setLoading(false));

    // Fetch dynamic categories
    categoriesApi.getAll()
      .then((data) => {
        const catNames = (Array.isArray(data) ? data : []).map((c) => c.nombre_categorias);
        setCategories(['Todos', ...catNames]);
      })
      .catch((err) => {
        console.error('Error al cargar categorías:', err);
      });
  }, []);

  useEffect(() => {
    let result = books;
    if (search.trim()) {
      result = result.filter((b) =>
        b.titulo_libros?.toLowerCase().includes(search.toLowerCase()) ||
        b.descripcion_libros?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category && category !== 'Todos') {
      result = result.filter((b) =>
        b.categorias?.some((cat) => cat.nombre_categorias?.toLowerCase() === category.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, category, books]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookClick = (book) => {
    if (!isAuthenticated) {
      navigate('/login?error=Para ver el detalle de los libros, leerlos y descargarlos, debes iniciar sesión o registrarte.');
      return;
    }
    navigate(`/libros/${book.id_libros}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-sky-50/60 via-slate-50/20 to-white border-b border-slate-100/80 px-4 pt-24 pb-20 text-center w-full">
        {/* Glow decorative blobs */}
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-sky-200/20 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[300px] h-[300px] rounded-full bg-blue-200/20 blur-[80px] pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100 mb-6">
            <BookOpen className="w-3.5 h-3.5" /> Biblioteca Digital
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 leading-tight mb-4 sm:text-6xl">
            Aprenizaje Continuo<br />
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-blue-800 bg-clip-text text-transparent">al alcance de todos.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
            Explora miles de libros digitales de manera gratuita. Lee, descarga y aprende sin límites.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto bg-white/90 backdrop-blur p-2.5 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100/50 transition-all duration-300">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar libros por título o descripción..."
                className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent"
              />
            </div>
            <div className="relative border-t sm:border-t-0 sm:border-l border-slate-100/80 pt-2 sm:pt-0 sm:pl-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 w-full sm:w-44 rounded-xl focus:outline-none text-sm text-slate-700 font-semibold cursor-pointer bg-transparent"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-20">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Catálogo de Libros
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filtered.length} {filtered.length === 1 ? 'libro disponible' : 'libros disponibles'}
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" className="py-20" />
        ) : error ? (
          <p className="text-center text-red-500 py-20">{error}</p>
        ) : (
          <BookGrid books={filtered} onBookClick={handleBookClick} isClickable={true} />
        )}
      </section>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center z-50 hover:scale-110"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
