const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacionController');
const { verificarToken, verificarTokenOpcional, autorizar } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO', 'LECTOR'), calificacionController.crear);
router.get('/', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO'), calificacionController.obtenerTodas);
router.get('/libro/:id', calificacionController.obtenerPorLibro);
router.get('/usuario/libro/:id', verificarTokenOpcional, calificacionController.obtenerCalificacionUsuario);
router.delete('/:id', verificarToken, autorizar('ADMIN', 'BIBLIOTECARIO', 'LECTOR'), calificacionController.eliminar);

module.exports = router;
