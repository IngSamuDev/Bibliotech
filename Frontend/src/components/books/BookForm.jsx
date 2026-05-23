import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateRequired, validateYear, validateUrl } from '../../utils/validators';
import { authorsApi, categoriesApi } from '../../api/catalogApi';
import { useNotification } from '../../hooks/useNotification';

const BookForm = ({ book = null, onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState({
    titulo_libros: '',
    descripcion_libros: '',
    anio_publicacion_libros: '',
    portada_url_libros: '',
    archivo_url_libros: '',
    autores: [],
    categorias: [],
    portada: null,
    archivo: null
  });
  const [errors, setErrors] = useState({});
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const { showWarning } = useNotification();

  useEffect(() => {
    Promise.all([authorsApi.getAll(), categoriesApi.getAll()])
      .then(([authorsData, categoriesData]) => {
        setAuthors(Array.isArray(authorsData) ? authorsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (book) {
      setForm({
        titulo_libros: book.titulo_libros || '',
        descripcion_libros: book.descripcion_libros || '',
        anio_publicacion_libros: book.anio_publicacion_libros || '',
        portada_url_libros: book.portada_url_libros || '',
        archivo_url_libros: book.archivo_url_libros || '',
        autores: (book.autores || []).map((a) => String(a.id_autores)),
        categorias: (book.categorias || []).map((c) => String(c.id_categorias)),
        portada: null,
        archivo: null
      });
    }
  }, [book]);

  const validate = () => {
    const newErrors = {};
    if (!validateRequired(form.titulo_libros)) newErrors.titulo_libros = 'El título es requerido';
    if (!validateRequired(form.descripcion_libros)) newErrors.descripcion_libros = 'La descripción es requerida';
    if (!validateYear(form.anio_publicacion_libros)) newErrors.anio_publicacion_libros = 'Ingresa un año válido (1000 - presente)';
    if (form.portada_url_libros && !validateUrl(form.portada_url_libros)) newErrors.portada_url_libros = 'URL de portada inválida';
    if (!form.archivo && !form.archivo_url_libros) newErrors.archivo_url_libros = 'Sube un PDF o escribe una URL';
    if (form.archivo_url_libros && !validateUrl(form.archivo_url_libros)) newErrors.archivo_url_libros = 'URL del archivo inválida';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleMultiSelect = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files?.[0] || null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showWarning('Por favor, completa los campos requeridos y corrige los errores.');
      return;
    }
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'autores' || key === 'categorias') data.append(key, JSON.stringify(value));
      else if (value !== null && value !== undefined) data.append(key, value);
    });
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Título"
        name="titulo_libros"
        value={form.titulo_libros}
        onChange={handleChange}
        placeholder="Título del libro"
        error={errors.titulo_libros}
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-800 mb-2">Autores</label>
          <div className="max-h-32 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2">
            {authors.map((author) => (
              <label key={author.id_autores} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={form.autores.includes(String(author.id_autores))}
                  onChange={() => handleMultiSelect('autores', String(author.id_autores))}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                {author.nombre_autores}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-800 mb-2">Categorías</label>
          <div className="max-h-32 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2">
            {categories.map((category) => (
              <label key={category.id_categorias} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={form.categorias.includes(String(category.id_categorias))}
                  onChange={() => handleMultiSelect('categorias', String(category.id_categorias))}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                {category.nombre_categorias}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          name="descripcion_libros"
          value={form.descripcion_libros}
          onChange={handleChange}
          placeholder="Descripción del libro"
          rows={8}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm ${
            errors.descripcion_libros ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-sky-500'
          } min-h-56 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
        />
        {errors.descripcion_libros && (
          <p className="mt-1 text-sm text-rose-600">{errors.descripcion_libros}</p>
        )}
      </div>

      <Input
        label="Año de publicación"
        type="number"
        name="anio_publicacion_libros"
        value={form.anio_publicacion_libros}
        onChange={handleChange}
        placeholder="2024"
        error={errors.anio_publicacion_libros}
        required
      />

      <Input
        label="URL de portada"
        name="portada_url_libros"
        value={form.portada_url_libros}
        onChange={handleChange}
        placeholder="https://..."
        error={errors.portada_url_libros}
      />

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-800 mb-2">Subir portada</label>
        <input
          type="file"
          name="portada"
          accept="image/*"
          onChange={handleFile}
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-sky-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-sky-700"
        />
      </div>

      <Input
        label="URL del archivo PDF"
        name="archivo_url_libros"
        value={form.archivo_url_libros}
        onChange={handleChange}
        placeholder="https://..."
        error={errors.archivo_url_libros}
      />

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-800 mb-2">Subir PDF</label>
        <input
          type="file"
          name="archivo"
          accept="application/pdf"
          onChange={handleFile}
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-sky-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-sky-700"
        />
        {errors.archivo_url_libros && <p className="mt-1 text-sm text-rose-600">{errors.archivo_url_libros}</p>}
      </div>

      <div className="flex gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {book ? 'Guardar cambios' : 'Agregar libro'}
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
