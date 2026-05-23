import { BookOpen } from 'lucide-react';

const BookCard = ({ book, onClick, isClickable = true }) => {
  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`bg-gray-50 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${
        isClickable ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      {/* Cover */}
      <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {book.portada_url_libros ? (
          <img
            src={book.portada_url_libros}
            alt={book.titulo_libros}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex items-center justify-center ${
            book.portada_url_libros ? 'hidden' : 'flex'
          }`}
        >
          <BookOpen className="w-12 h-12 text-gray-300" />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 mb-1">
          {book.titulo_libros}
        </h3>
        <p className="text-xs text-slate-500">{book.anio_publicacion_libros}</p>
      </div>
    </div>
  );
};

export default BookCard;
