const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividadController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

// Solo ADMIN accede a la auditoría del sistema
router.get('/', verificarToken, autorizar('ADMIN'), actividadController.listar);
router.post('/', verificarToken, autorizar('ADMIN'), actividadController.registrar);
router.delete('/:id', verificarToken, autorizar('ADMIN'), actividadController.eliminar);

module.exports = router;