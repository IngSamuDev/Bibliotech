import BookCard from './BookCard';
import { BookOpen } from 'lucide-react';

const BookGrid = ({ books = [], onBookClick, isClickable = true }) => {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-slate-500">
        <BookOpen className="w-12 h-12 mb-3 text-slate-300" />
        <p className="text-sm font-medium text-slate-700">No hay libros disponibles</p>
        <p className="mt-1 text-xs">Prueba otra búsqueda o vuelve más tarde.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {books.map((book) => (
        <BookCard
          key={book.id_libros}
          book={book}
          onClick={() => onBookClick && onBookClick(book)}
          isClickable={isClickable}
        />
      ))}
    </div>
  );
};

export default BookGrid;
