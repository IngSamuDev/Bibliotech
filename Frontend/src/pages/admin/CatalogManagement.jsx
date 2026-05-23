import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { authorsApi, categoriesApi } from '../../api/catalogApi';
import { useNotification } from '../../hooks/useNotification';

const CatalogManagement = ({ type }) => {
  const isAuthors = type === 'authors';
  const api = isAuthors ? authorsApi : categoriesApi;
  const title = isAuthors ? 'Autores' : 'Categorías';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '' });
  const { showSuccess, showError, showWarning } = useNotification();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError(`Error al cargar ${title.toLowerCase()}`);
      showError(`Error al cargar ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  }, [api, title]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setSelected(null);
    setForm({ name: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setSelected(item);
    setForm({
      name: isAuthors ? item.nombre_autores : item.nombre_categorias,
      description: isAuthors ? item.nacionalidad_autores || '' : item.descripcion_categorias || ''
    });
    setModalOpen(true);
  };

  const payload = () => isAuthors
    ? { nombre_autores: form.name, nacionalidad_autores: form.description }
    : { nombre_categorias: form.name, descripcion_categorias: form.description };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name || !form.name.trim()) {
      showWarning('El nombre es obligatorio.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (selected) {
        await api.update(isAuthors ? selected.id_autores : selected.id_categorias, payload());
        showSuccess(`${isAuthors ? 'Autor' : 'Categoría'} actualizado con éxito`);
      } else {
        await api.create(payload());
        showSuccess(`${isAuthors ? 'Autor' : 'Categoría'} creado con éxito`);
      }
      setModalOpen(false);
      await fetchItems();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al guardar';
      setError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const openDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const remove = async () => {
    if (!itemToDelete) return;
    setSubmitting(true);
    setError('');
    try {
      await api.delete(isAuthors ? itemToDelete.id_autores : itemToDelete.id_categorias);
      showSuccess(`${isAuthors ? 'Autor' : 'Categoría'} eliminado con éxito`);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      await fetchItems();
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo eliminar. Puede estar asociado a libros.';
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
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{items.length} registros</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Añadir {isAuthors ? 'autor' : 'categoría'}</Button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {loading ? <LoadingSpinner size="lg" className="py-20" /> : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">{isAuthors ? 'Autor' : 'Categoría'}</th>
                <th className="px-5 py-3">{isAuthors ? 'Nacionalidad' : 'Descripción'}</th>
                <th className="px-5 py-3">Libros</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={isAuthors ? item.id_autores : item.id_categorias} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    {isAuthors ? item.nombre_autores : item.nombre_categorias}
                  </td>
                  <td className="max-w-xl px-5 py-4 leading-6 text-slate-600">
                    {isAuthors ? item.nacionalidad_autores || 'Sin nacionalidad' : item.descripcion_categorias || 'Sin descripción'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{item.libros || 0} libros</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Editar</button>
                      <button onClick={() => openDelete(item)} disabled={submitting} className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? `Editar ${title.toLowerCase()}` : `Añadir ${title.toLowerCase()}`} maxWidth="max-w-2xl">
        <form onSubmit={save}>
          <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-800">{isAuthors ? 'Nacionalidad' : 'Descripción'}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" isLoading={submitting} className="flex-1">Guardar</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={`Eliminar ${isAuthors ? 'Autor' : 'Categoría'}`}
        entityName={isAuthors ? 'el autor' : 'la categoría'}
        itemName={itemToDelete ? (isAuthors ? itemToDelete.nombre_autores : itemToDelete.nombre_categorias) : ''}
        onConfirm={remove}
        isLoading={submitting}
        error={error}
        onDismissError={() => setError('')}
      />
    </div>
  );
};

export default CatalogManagement;
