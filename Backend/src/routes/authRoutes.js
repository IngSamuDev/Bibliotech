const express = require('express');
const router = express.Router();
const { registro, login } = require('../controllers/authController');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

router.post('/registro', registro);
router.post('/login', login);

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const googleConfigured = () => (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  !process.env.GOOGLE_CLIENT_ID.includes('your-google') &&
  !process.env.GOOGLE_CLIENT_SECRET.includes('your-google')
);

const redirectWithUser = (res, user) => {
  const token = jwt.sign(
    { id_usuario: user.id_usuarios, rol: user.nombre_roles, email: user.email_usuarios },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
    id: user.id_usuarios,
    nombre: user.nombre_usuarios,
    rol: user.nombre_roles
  }))}`);
};

router.get('/google', async (req, res, next) => {
  if (!googleConfigured()) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Google OAuth no está configurado en el servidor')}`);
  }

  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    prompt: 'select_account'
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (error, user) => {
    if (error || !user) {
      console.error('Error en Google OAuth:', error?.message || 'Usuario no recibido');
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('No se pudo iniciar sesión con Google. Verifica el Client ID, Client Secret y URI de redirección.')}`);
    }

    return redirectWithUser(res, user);
  })(req, res, next);
});

module.exports = router;
