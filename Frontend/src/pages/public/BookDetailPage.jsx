import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, BookOpen, ArrowLeft, Star, User, Sparkles } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import BookGrid from '../../components/books/BookGrid';
import { booksApi } from '../../api/booksApi';
import { ratingsApi } from '../../api/ratingsApi';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [isReading, setIsReading] = useState(false);
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const [ratings, setRatings] = useState({ calificaciones: [], promedio: 0, total: 0 });
  const [userRating, setUserRating] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchRatingsData = async () => {
    try {
      const ratingsData = await ratingsApi.getByBook(id);
      setRatings(ratingsData);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    }
  };

  const fetchUserRatingData = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await ratingsApi.getUserRating(id);
      if (response.data) {
        setUserRating(response.data);
        setNewRating(response.data.puntuacion_calificaciones);
        setComment(response.data.comentario_calificaciones || '');
      } else {
        setUserRating(null);
        setNewRating(0);
        setComment('');
      }
    } catch (err) {
      console.error('Error fetching user rating:', err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?error=Debes iniciar sesión o registrarte para acceder al detalle de los libros.');
      return;
    }
    setLoading(true);
    setActionError('');
    setIsReading(false);

    Promise.all([
      booksApi.getById(id),
      booksApi.getAll(),
      ratingsApi.getByBook(id).catch(() => ({ calificaciones: [], promedio: 0, total: 0 })),
      isAuthenticated ? ratingsApi.getUserRating(id).catch(() => ({ data: null })) : Promise.resolve({ data: null })
    ])
      .then(([data, allBooks, ratingsData, userRatingRes]) => {
        setBook(data);
        setRatings(ratingsData);
        if (userRatingRes && userRatingRes.data) {
          setUserRating(userRatingRes.data);
          setNewRating(userRatingRes.data.puntuacion_calificaciones);
          setComment(userRatingRes.data.comentario_calificaciones || '');
        } else {
          setUserRating(null);
          setNewRating(0);
          setComment('');
        }

        const authorIds = new Set(data.autores?.map((author) => author.id_autores));
        const categoryIds = new Set(data.categorias?.map((category) => category.id_categorias));
        const related = (Array.isArray(allBooks) ? allBooks : [])
          .filter((item) => item.id_libros !== data.id_libros)
          .filter((item) =>
            item.autores?.some((author) => authorIds.has(author.id_autores)) ||
            item.categorias?.some((category) => categoryIds.has(category.id_categorias))
          )
          .slice(0, 4);
        setSuggestedBooks(related);
        return booksApi.registerView(id).catch(() => {});
      })
      .finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  const downloadPdf = async () => {
    if (!book.archivo_url_libros) {
      const msg = 'Este libro no tiene un PDF disponible para descargar.';
      setActionError(msg);
      showWarning(msg);
      return;
    }
    showInfo('Iniciando la descarga de su libro...');
    try {
      await booksApi.registerDownload(id).catch(() => {});
      const response = await fetch(book.archivo_url_libros);
      if (!response.ok) throw new Error('No se pudo obtener el PDF');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(book.titulo_libros || 'libro').replace(/[\\/:*?"<>|]/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccess('¡La descarga se ha completado con éxito!');
    } catch {
      const msg = 'No se pudo descargar el PDF. Intenta de nuevo.';
      setActionError(msg);
      showError(msg);
    }
  };

  const readOnline = () => {
    if (!book.archivo_url_libros) {
      const msg = 'Este libro no tiene un PDF disponible para leer en línea.';
      setActionError(msg);
      showWarning(msg);
      return;
    }
    showInfo('Cargando visor inmersivo...');
    setIsReading(true);
  };

  const handleSubmitRating = async () => {
    if (newRating === 0) {
      showWarning('Por favor selecciona una calificación con estrellas antes de enviar.');
      return;
    }
    setSubmittingRating(true);
    try {
      await ratingsApi.create(id, newRating, comment);
      showSuccess(userRating ? 'Su reseña ha sido actualizada con éxito' : '¡Gracias! Su calificación y comentario han sido guardados con éxito');
      await fetchRatingsData();
      await fetchUserRatingData();
    } catch (err) {
      console.error('Error submitting rating:', err);
      const msg = 'No se pudo guardar la calificación. Intenta de nuevo.';
      setActionError(msg);
      showError(msg);
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50"><Navbar /><LoadingSpinner size="lg" className="py-24" /></div>;
  if (!book) return <div className="min-h-screen bg-slate-50"><Navbar /><p className="py-24 text-center text-slate-500">Libro no encontrado</p></div>;

  if (isReading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-[fadeIn_0.2s_ease-out]">
        {/* Header toolbar */}
        <div className="bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/10 text-white shadow-2xl relative z-10">
          <button
            onClick={() => setIsReading(false)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-full transition-all duration-200 hover:-translate-x-0.5 active:scale-95 shadow-inner"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al Detalle
          </button>
          <div className="flex flex-col items-center max-w-xs sm:max-w-md md:max-w-xl text-center">
            <h2 className="text-sm md:text-base font-bold text-slate-100 truncate w-full tracking-wide flex items-center gap-2 justify-center">
              <BookOpen className="h-4.5 w-4.5 text-sky-400 animate-pulse" /> {book.titulo_libros}
            </h2>
            <p className="hidden sm:block text-[10px] text-slate-400 font-semibold mt-0.5">
              Modo Lectura Inmersiva
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={downloadPdf}
              disabled={!book.archivo_url_libros}
              className="bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] hover:shadow-emerald-500/20 text-white border border-emerald-500/20 px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all text-xs"
            >
              <Download className="h-4 w-4" /> Descargar PDF
            </Button>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-3.5 py-2 bg-sky-950/80 text-sky-400 rounded-xl border border-sky-500/25 shadow-inner">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping"></span>
              Visor Premium
            </span>
          </div>
        </div>
        
        {/* PDF Iframe Viewer */}
        <div className="flex-1 bg-slate-900 relative">
          <iframe
            src={book.archivo_url_libros}
            title={book.titulo_libros}
            className="w-full h-full border-none bg-slate-900"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-xl bg-slate-200/70 p-8">
          {book.portada_url_libros ? (
            <img src={book.portada_url_libros} alt={book.titulo_libros} className="mx-auto aspect-[3/4] w-full max-w-60 rounded-xl object-cover shadow-xl" />
          ) : (
            <div className="mx-auto flex aspect-[3/4] w-full max-w-60 items-center justify-center rounded-xl bg-white shadow-sm">
              <BookOpen className="h-14 w-14 text-slate-300" />
            </div>
          )}
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Volver
          </button>
          <div className="mb-3 flex flex-wrap gap-2">
            {book.categorias?.map((category) => (
              <span key={category.id_categorias} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">{category.nombre_categorias}</span>
            ))}
          </div>
          <h1 className="text-3xl font-semibold text-slate-950">{book.titulo_libros}</h1>
          <p className="mt-3 text-sm font-semibold text-sky-700">{book.autores?.map((a) => a.nombre_autores).join(', ') || 'Autor no asignado'}</p>
          <p className="mt-1 text-slate-500">{book.anio_publicacion_libros}</p>

          <div className="my-6 grid max-w-md grid-cols-3 rounded-xl bg-slate-50 p-4">
            <div className="border-r border-slate-200 text-center">
              <p className="text-2xl font-semibold text-sky-600">{book.descargas ?? 0}</p>
              <p className="text-sm text-slate-500">Descargas</p>
            </div>
            <div className="border-r border-slate-200 text-center">
              <p className="text-2xl font-semibold text-emerald-600">{book.lecturas ?? 0}</p>
              <p className="text-sm text-slate-500">Lecturas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-amber-500 flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400 shrink-0" />
                <span>{parseFloat(ratings.promedio || 0).toFixed(1)}</span>
              </p>
              <p className="text-sm text-slate-500">{ratings.total || 0} {ratings.total === 1 ? 'Voto' : 'Votos'}</p>
            </div>
          </div>

          <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-slate-700">{book.descripcion_libros || 'Este libro no tiene descripción.'}</p>
          <p className="mt-6 text-sm text-slate-500">Subido por <span className="font-semibold text-slate-700">{book.subido_por}</span></p>

          {actionError && <ErrorMessage message={actionError} onDismiss={() => setActionError('')} className="mt-6 max-w-3xl" />}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={readOnline} disabled={!book.archivo_url_libros}><BookOpen className="h-4 w-4" /> Leer en línea</Button>
            <Button onClick={downloadPdf} disabled={!book.archivo_url_libros} className="bg-emerald-600 hover:bg-emerald-700"><Download className="h-4 w-4" /> Descargar PDF</Button>
          </div>
        </section>
        </div>

        {/* Ratings & Reviews Section */}
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Calificaciones y Reseñas</h2>
              <p className="text-xs text-slate-500">Opiniones de los lectores de Bibliotech</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
            {/* Left side: Rating Summary */}
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="text-center rounded-2xl bg-slate-50 border border-slate-100 p-6 min-w-32 shadow-sm">
                  <p className="text-5xl font-extrabold text-slate-950">{parseFloat(ratings.promedio || 0).toFixed(1)}</p>
                  <div className="flex items-center justify-center gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(ratings.promedio || 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-3">
                    {ratings.total || 0} {ratings.total === 1 ? 'opinión' : 'opiniones'}
                  </p>
                </div>

                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = ratings.calificaciones?.filter(r => r.puntuacion_calificaciones === stars).length || 0;
                    const percent = ratings.total ? Math.round((count / ratings.total) * 100) : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs">
                        <span className="font-semibold text-slate-500 w-3 text-right">{stars}</span>
                        <Star className="w-3.5 h-3.5 fill-slate-300 text-slate-300 shrink-0" />
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-amber-400" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-slate-400 font-medium w-8 text-right">{percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form to submit review */}
              <div className="border-t border-slate-100 pt-6">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-950">
                      {userRating ? 'Edita tu calificación' : 'Escribe tu opinión'}
                    </h3>
                    
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewRating(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="transition-transform hover:scale-110 active:scale-95 animate-none border-none bg-transparent p-0 outline-none cursor-pointer"
                          type="button"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= (hoveredStar || newRating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Cuéntale a otros qué te pareció este libro..."
                      className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-slate-50/50 resize-none transition-all"
                      rows={3}
                    />

                    <Button
                      onClick={handleSubmitRating}
                      isLoading={submittingRating}
                      disabled={newRating === 0}
                      className="bg-slate-950 hover:bg-sky-600 text-white rounded-xl shadow-md text-xs py-2.5 px-5 font-bold transition-all active:scale-[0.98]"
                    >
                      {userRating ? 'Actualizar Reseña' : 'Enviar Calificación'}
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-sky-100/50 bg-gradient-to-br from-sky-50/40 via-slate-50/30 to-indigo-50/20 p-6 text-center shadow-sm relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-sky-200/20 blur-xl pointer-events-none" />
                    <Sparkles className="h-6 w-6 text-sky-500 mx-auto mb-3 animate-[pulse_2s_infinite]" />
                    <p className="text-xs italic font-serif text-slate-700 max-w-xs mx-auto leading-relaxed">
                      "Siempre imaginé que el Paraíso sería algún tipo de biblioteca."
                    </p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-sky-700/80 mt-1 mb-3">
                      — Jorge Luis Borges
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed mb-4">
                      Únete a nuestra comunidad de lectores para poder calificar este libro y compartir tu experiencia con nosotros.
                    </p>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-5 py-2.5 bg-slate-950 text-white text-[11px] font-bold rounded-xl hover:bg-sky-600 active:scale-95 shadow-md shadow-slate-950/10 hover:shadow-sky-600/20 transition-all duration-200"
                    >
                      Iniciar Sesión para Calificar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Reviews List */}
            <div className="border-t border-slate-100 pt-6 md:border-t-0 md:pt-0 md:pl-6 md:border-l md:border-slate-100">
              <h3 className="text-sm font-bold text-slate-950 mb-4 flex items-center gap-1.5">
                Reseñas de Lectores <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">{ratings.calificaciones?.length || 0}</span>
              </h3>

              {ratings.calificaciones?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50/20 border border-dashed border-slate-200/80 rounded-2xl">
                  <User className="h-8 w-8 text-slate-300 stroke-[1.5] mb-2" />
                  <p className="text-xs font-semibold text-slate-600">Aún no hay reseñas</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">¡Sé el primero en calificar este libro!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                  {ratings.calificaciones?.map((rating) => {
                    const initials = rating.nombre_usuarios ? rating.nombre_usuarios.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() : 'U';
                    const colors = [
                      'bg-sky-100 text-sky-700',
                      'bg-emerald-100 text-emerald-700',
                      'bg-violet-100 text-violet-700',
                      'bg-amber-100 text-amber-700',
                      'bg-rose-100 text-rose-700'
                    ];
                    // select color based on hash of name
                    const colorIndex = rating.nombre_usuarios ? rating.nombre_usuarios.charCodeAt(0) % colors.length : 0;
                    const avatarColor = colors[colorIndex];

                    return (
                      <div key={rating.id_calificaciones} className="group relative flex flex-col justify-between rounded-2xl border border-slate-100/80 bg-slate-50/30 p-4 transition-all hover:bg-slate-50/70 hover:shadow-sm">
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shadow-inner shrink-0 ${avatarColor}`}>
                              {initials}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{rating.nombre_usuarios}</p>
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= rating.puntuacion_calificaciones
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {new Date(rating.fecha_calificacion_calificaciones).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        {rating.comentario_calificaciones && (
                          <p className="text-xs leading-relaxed text-slate-600 bg-white/60 border border-slate-100/50 rounded-xl p-3 shadow-inner shadow-slate-50">
                            {rating.comentario_calificaciones}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {suggestedBooks.length > 0 && (
          <section className="mt-10">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-700">También te puede gustar</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Sugeridos para continuar leyendo</h2>
              </div>
            </div>
            <BookGrid
              books={suggestedBooks}
              onBookClick={(suggested) => navigate(`/libros/${suggested.id_libros}`)}
              isClickable
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default BookDetailPage;
