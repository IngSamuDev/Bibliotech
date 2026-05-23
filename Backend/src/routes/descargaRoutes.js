const express = require('express');
const router = express.Router();
const descargaController = require('../controllers/descargaController');
const { verificarToken, verificarTokenOpcional, autorizar } = require('../middlewares/authMiddleware');

// ADMIN ve todo el historial
router.get('/', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), descargaController.listar);
// Cada usuario ve su propio historial
router.get('/mi-historial', verificarToken, autorizar('BIBLIOTECARIO', 'LECTOR'), descargaController.miHistorial);
// Todos pueden registrar una descarga
router.post('/', verificarTokenOpcional, descargaController.registrar);
// Solo ADMIN y BIBLIOTECARIO eliminan registros
router.delete('/:id', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), descargaController.eliminar);

module.exports = router;