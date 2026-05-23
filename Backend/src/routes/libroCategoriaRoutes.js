const express = require('express');
const router = express.Router();
const libroCategoriaController = require('../controllers/libroCategoriaController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

router.get('/:id_libros', verificarToken, autorizar('BIBLIOTECARIO', 'LECTOR'), libroCategoriaController.obtenerPorLibro);
router.post('/', verificarToken, autorizar('BIBLIOTECARIO'), libroCategoriaController.agregar);
router.delete('/', verificarToken, autorizar('BIBLIOTECARIO'), libroCategoriaController.eliminar);

module.exports = router;