const express = require('express');
const router = express.Router();
const visualizacionController = require('../controllers/visualizacionController');
const { verificarToken, verificarTokenOpcional, autorizar } = require('../middlewares/authMiddleware');

// Solo ADMIN ve todas las visualizaciones
router.get('/', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), visualizacionController.listar);
router.get('/mi-historial', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO', 'LECTOR'), visualizacionController.miHistorial);
router.post('/', verificarTokenOpcional, visualizacionController.registrar);
router.delete('/:id', verificarToken, autorizar('ADMIN'), visualizacionController.eliminar);

module.exports = router;
