const express = require('express');
const router = express.Router();
const autorController = require('../controllers/autorController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

// Lectura: Lector y Bibliotecario
router.get('/', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO', 'LECTOR'), autorController.listar);
router.get('/:id', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO', 'LECTOR'), autorController.obtenerUno);

// Escritura: Solo Bibliotecario
router.post('/', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), autorController.crear);
router.put('/:id', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), autorController.actualizar);
router.delete('/:id', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), autorController.eliminar);

module.exports = router;
