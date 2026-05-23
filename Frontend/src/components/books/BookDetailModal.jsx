import { useState, useEffect } from 'react';
import { Star, Download, BookOpen, X, User } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { ratingsApi } from '../../api/ratingsApi';
import { booksApi } from '../../api/booksApi';
import axiosInstance from '../../api/axios';

const BookDetailModal = ({ book, isOpen, onClose }) => {
  const [ratings, setRatings] = useState({ calificaciones: [], promedio: 0, total: 0 });
  const [userRating, setUserRating] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (isOpen && book) {
      fetchRatings();
      fetchUserRating();
    }
  }, [isOpen, book]);

  const fetchRatings = async () => {
    try {
      const data = await ratingsApi.getByBook(book.id_libros);
      setRatings(data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const response = await ratingsApi.getUserRating(book.id_libros);
      if (response.data) {
        setUserRating(response.data);
        setNewRating(response.data.puntuacion_calificaciones);
        setComment(response.data.comentario_calificaciones || '');
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  };

  const handleSubmitRating = async () => {
    if (newRating === 0) return;
    setLoading(true);
    try {
      await ratingsApi.create(book.id_libros, newRating, comment);
      await fetchRatings();
      await fetchUserRating();
      setComment('');
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadOnline = async () => {
    try {
      await axiosInstance.post('/visualizaciones', { id_libros: book.id_libros });
      window.open(book.archivo_url_libros, '_blank');
    } catch (error) {
      console.error('Error registering visualization:', error);
    }
  };

  const handleDownload = async () => {
    try {
      await axiosInstance.post('/descargas', { id_libros: book.id_libros });
      const link = document.createElement('a');
      link.href = book.archivo_url_libros;
      link.download = `${book.titulo_libros}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error registering download:', error);
    }
  };

  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={book.titulo_libros} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Book Info */}
        <div className="flex gap-6">
          <div className="w-32 h-48 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
            {book.portada_url_libros ? (
              <img src={book.portada_url_libros} alt={book.titulo_libros} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-300" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500 mb-2">Año: {book.anio_publicacion_libros}</p>
            <p className="text-slate-700 leading-relaxed">{book.descripcion_libros}</p>
            
            {/* Rating Summary */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(ratings.promedio)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {ratings.promedio} ({ratings.total} {ratings.total === 1 ? 'calificación' : 'calificaciones'})
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleReadOnline} className="flex-1 flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" />
            Leer en línea
          </Button>
          <Button onClick={handleDownload} variant="secondary" className="flex-1 flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Descargar PDF
          </Button>
        </div>

        {/* User Rating */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-semibold text-slate-900 mb-3">
            {userRating ? 'Tu calificación' : 'Califica este libro'}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setNewRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= (hoveredStar || newRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe un comentario (opcional)"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <Button
            onClick={handleSubmitRating}
            isLoading={loading}
            disabled={newRating === 0}
            className="mt-3"
          >
            {userRating ? 'Actualizar calificación' : 'Enviar calificación'}
          </Button>
        </div>

        {/* Reviews */}
        {ratings.calificaciones.length > 0 && (
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-slate-900 mb-4">Reseñas</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {ratings.calificaciones.map((rating) => (
                <div key={rating.id_calificaciones} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{rating.nombre_usuarios}</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= rating.puntuacion_calificaciones
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(rating.fecha_calificacion_calificaciones).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comentario_calificaciones && (
                    <p className="text-sm text-slate-600 leading-relaxed">{rating.comentario_calificaciones}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BookDetailModal;
