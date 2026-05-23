const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

// Solo ADMIN puede gestionar roles
router.get('/', verificarToken, autorizar('ADMIN'), rolController.listar);
router.get('/:id', verificarToken, autorizar('ADMIN'), rolController.obtenerUno);
router.post('/', verificarToken, autorizar('ADMIN'), rolController.crear);
router.put('/:id', verificarToken, autorizar('ADMIN'), rolController.actualizar);
router.delete('/:id', verificarToken, autorizar('ADMIN'), rolController.eliminar);

module.exports = router;