const express = require('express');
const router = express.Router();
const libroAutorController = require('../controllers/libroAutorController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

router.get('/:id_libros', verificarToken, autorizar('BIBLIOTECARIO', 'LECTOR'), libroAutorController.obtenerPorLibro);
router.post('/', verificarToken, autorizar('BIBLIOTECARIO'), libroAutorController.agregar);
router.delete('/', verificarToken, autorizar('BIBLIOTECARIO'), libroAutorController.eliminar);

module.exports = router;