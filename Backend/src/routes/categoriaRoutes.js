const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

router.get('/', categoriaController.listar);
router.get('/:id', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO', 'LECTOR'), categoriaController.obtenerUno);
router.post('/', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), categoriaController.crear);
router.put('/:id', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), categoriaController.actualizar);
router.delete('/:id', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), categoriaController.eliminar);

module.exports = router;
