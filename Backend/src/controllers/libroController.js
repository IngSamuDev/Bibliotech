const libroModel = require('../models/libroModel');

const fileUrl = (req, file, folder) => {
    if (!file) return null;
    return `${req.protocol}://${req.get('host')}/uploads/${folder}/${file.filename}`;
};

const parseIds = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(Number).filter(Boolean);
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.map(Number).filter(Boolean);
    } catch {
        return String(value).split(',').map(Number).filter(Boolean);
    }
    return [];
};

const listar = async (req, res) => {
    try {
        const data = await libroModel.obtenerTodos();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const listarAdmin = async (req, res) => {
    try {
        const data = await libroModel.obtenerTodosAdmin();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerUno = async (req, res) => {
    try {
        const data = await libroModel.obtenerPorId(req.params.id);
        if (!data) return res.status(404).json({ message: 'Libro no encontrado' });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const crear = async (req, res) => {
    try {
        const { titulo_libros, descripcion_libros, anio_publicacion_libros } = req.body;
        const archivo_url_libros = fileUrl(req, req.files?.archivo?.[0], 'pdfs') || req.body.archivo_url_libros;
        const portada_url_libros = fileUrl(req, req.files?.portada?.[0], 'covers') || req.body.portada_url_libros;
        if (!titulo_libros || !archivo_url_libros) {
            return res.status(400).json({ message: 'Título y URL del archivo son obligatorios' });
        }
        const id_usuarios = req.usuario.id_usuario;
        const data = await libroModel.crear(titulo_libros, descripcion_libros, anio_publicacion_libros, archivo_url_libros, portada_url_libros, id_usuarios);
        await libroModel.sincronizarAutores(data.id_libros, parseIds(req.body.autores));
        await libroModel.sincronizarCategorias(data.id_libros, parseIds(req.body.categorias));
        res.status(201).json({ message: 'Libro creado correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizar = async (req, res) => {
    try {
        const actual = await libroModel.obtenerPorId(req.params.id);
        if (!actual) return res.status(404).json({ message: 'Libro no encontrado' });
        const { titulo_libros, descripcion_libros, anio_publicacion_libros } = req.body;
        const archivo_url_libros = fileUrl(req, req.files?.archivo?.[0], 'pdfs') || req.body.archivo_url_libros || actual.archivo_url_libros;
        const portada_url_libros = fileUrl(req, req.files?.portada?.[0], 'covers') || req.body.portada_url_libros || actual.portada_url_libros;
        const data = await libroModel.actualizar(req.params.id, titulo_libros, descripcion_libros, anio_publicacion_libros, archivo_url_libros, portada_url_libros);
        if (!data) return res.status(404).json({ message: 'Libro no encontrado' });
        await libroModel.sincronizarAutores(data.id_libros, parseIds(req.body.autores));
        await libroModel.sincronizarCategorias(data.id_libros, parseIds(req.body.categorias));
        res.json({ message: 'Libro actualizado correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const data = await libroModel.eliminar(req.params.id);
        if (!data) return res.status(404).json({ message: 'Libro no encontrado' });
        res.json({ message: 'Libro desactivado correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { activo_libros } = req.body;
        if (activo_libros === undefined) {
            return res.status(400).json({ message: 'El campo activo_libros es obligatorio' });
        }
        const data = await libroModel.cambiarEstado(req.params.id, activo_libros);
        if (!data) return res.status(404).json({ message: 'Libro no encontrado' });
        res.json({ message: activo_libros ? 'Libro activado correctamente' : 'Libro desactivado correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { listar, listarAdmin, obtenerUno, crear, actualizar, eliminar, cambiarEstado };
