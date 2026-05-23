const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');
const { uploadBookFiles } = require('../middlewares/uploadMiddleware');

// El catalogo publico se puede ver sin sesion; las acciones de lectura/gestion siguen protegidas.
router.get('/', libroController.listar);
router.get('/admin/todos', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), libroController.listarAdmin);
router.get('/:id', libroController.obtenerUno);
router.post('/', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), uploadBookFiles, libroController.crear);
router.put('/:id', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), uploadBookFiles, libroController.actualizar);
router.patch('/:id', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), libroController.cambiarEstado);
router.delete('/:id', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), libroController.eliminar);

module.exports = router;
