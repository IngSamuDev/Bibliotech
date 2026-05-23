const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

// Solo ADMIN gestiona usuarios
router.get('/', verificarToken, autorizar('ADMIN'), usuarioController.listar);
router.get('/:id', verificarToken, autorizar('ADMIN'), usuarioController.obtenerUno);
router.post('/', verificarToken, autorizar('ADMIN'), usuarioController.crear);
router.put('/:id', verificarToken, autorizar('ADMIN'), usuarioController.actualizar);
router.patch('/:id', verificarToken, autorizar('ADMIN'), usuarioController.cambiarEstado);
router.delete('/:id', verificarToken, autorizar('ADMIN'), usuarioController.eliminar);

module.exports = router;