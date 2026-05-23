import { Pencil, Trash2, BookOpen, Power, PowerOff } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const BookTable = ({ books = [], onEdit, onDelete, onToggleStatus, isLoading }) => {
  if (isLoading) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-slate-500">
        <BookOpen className="w-10 h-10 mb-3 text-slate-300" />
        <p className="text-sm font-medium text-slate-700">No hay libros registrados</p>
        <p className="mt-1 text-xs text-slate-500">Agrega el primer título para activar el catálogo.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-3 font-semibold text-slate-600">Portada</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">Libro</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Autores</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Categorías</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">Descargas</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">Estado</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {books.map((book) => (
            <tr key={book.id_libros} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                {book.portada_url_libros ? (
                  <img
                    src={book.portada_url_libros}
                    alt={book.titulo_libros}
                    className="w-11 h-14 object-cover rounded-md border border-slate-200"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-11 h-14 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200">
                    <BookOpen className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900 max-w-[200px]">
                <span className="line-clamp-2">{book.titulo_libros}</span>
                <span className="block text-xs font-normal text-slate-500">{book.anio_publicacion_libros}</span>
              </td>
              <td className="px-4 py-3 text-slate-500 hidden lg:table-cell max-w-[220px]">
                <span className="line-clamp-2">{book.autores?.map((a) => a.nombre_autores).join(', ') || 'Sin autor'}</span>
              </td>
              <td className="px-4 py-3 text-slate-500 hidden lg:table-cell max-w-[260px]">
                <span className="line-clamp-2">{book.categorias?.map((c) => c.nombre_categorias).join(', ') || 'Sin categoría'}</span>
              </td>
              <td className="px-4 py-3 text-slate-700">{book.descargas ?? 0}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  book.activo_libros ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${book.activo_libros ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {book.activo_libros ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(book)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-sky-50 hover:text-sky-700 transition-all"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleStatus(book)}
                    className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition-all ${
                      book.activo_libros
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                    title={book.activo_libros ? 'Desactivar' : 'Activar'}
                  >
                    {book.activo_libros ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => onDelete(book)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
