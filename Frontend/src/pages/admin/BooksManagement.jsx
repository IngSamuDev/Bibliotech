import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import BookTable from '../../components/books/BookTable';
import BookForm from '../../components/books/BookForm';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { booksApi } from '../../api/booksApi';
import { useNotification } from '../../hooks/useNotification';

const BooksManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToToggle, setBookToToggle] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { showSuccess, showError } = useNotification();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await booksApi.getAllAdmin();
      setBooks(Array.isArray(data) ? data : []);
    } catch {
      setError('Error al cargar los libros');
      showError('Error al cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleAdd = () => {
    setSelectedBook(null);
    setModalOpen(true);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleDelete = (book) => {
    setSelectedBook(book);
    setDeleteModalOpen(true);
  };

  const handleToggleStatus = (book) => {
    setBookToToggle(book);
    setStatusModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      if (selectedBook) {
        await booksApi.update(selectedBook.id_libros, formData);
        showSuccess('Libro actualizado con éxito');
      } else {
        await booksApi.create(formData);
        showSuccess('Libro creado con éxito');
      }
      setModalOpen(false);
      fetchBooks();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al guardar el libro';
      setError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setSubmitting(true);
    setError('');
    try {
      await booksApi.delete(selectedBook.id_libros);
      showSuccess('Libro eliminado con éxito');
      setDeleteModalOpen(false);
      fetchBooks();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al eliminar el libro';
      setError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmToggle = async () => {
    if (!bookToToggle) return;
    setSubmitting(true);
    setError('');
    try {
      await booksApi.setStatus(bookToToggle.id_libros, !bookToToggle.activo_libros);
      showSuccess(`Libro ${bookToToggle.activo_libros ? 'desactivado' : 'activado'} con éxito`);
      setStatusModalOpen(false);
      setBookToToggle(null);
      fetchBooks();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al cambiar el estado del libro';
      setError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Libros</h1>
          <p className="text-slate-500 text-sm mt-1">{books.length} libros activos en el catálogo</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Agregar Libro
        </Button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} className="mb-4" />}

      <BookTable books={books} onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} isLoading={loading} />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedBook ? 'Editar Libro' : 'Agregar Libro'}
        maxWidth="max-w-4xl"
      >
        {error && <ErrorMessage message={error} onDismiss={() => setError('')} className="mb-4" />}
        <BookForm
          book={selectedBook}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isLoading={submitting}
        />
      </Modal>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Eliminar Libro"
        entityName="el libro"
        itemName={selectedBook?.titulo_libros}
        onConfirm={handleConfirmDelete}
        isLoading={submitting}
        error={error}
        onDismissError={() => setError('')}
      />

      <ConfirmModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={bookToToggle?.activo_libros ? 'Desactivar Libro' : 'Activar Libro'}
        message={`¿Estás seguro de que deseas ${bookToToggle?.activo_libros ? 'desactivar' : 'activar'} "${bookToToggle?.titulo_libros || 'este libro'}"?`}
        confirmText={bookToToggle?.activo_libros ? 'Desactivar' : 'Activar'}
        confirmVariant={bookToToggle?.activo_libros ? 'danger' : 'primary'}
        onConfirm={handleConfirmToggle}
        isLoading={submitting}
        error={error}
        onDismissError={() => setError('')}
      />
    </div>
  );
};

export default BooksManagement;
