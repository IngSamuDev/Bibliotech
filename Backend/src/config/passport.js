const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { buscarPorEmail, crearUsuario } = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const nombre = profile.displayName || email?.split('@')[0] || 'Usuario Google';

      if (!email) {
        return done(new Error('Google no devolvió un correo electrónico para esta cuenta'), null);
      }

      let usuario = await buscarPorEmail(email);

      if (!usuario) {
        const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
        await crearUsuario(nombre, email, randomPassword, 3, 'google');
        usuario = await buscarPorEmail(email);
      }

      return done(null, usuario);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id_usuarios);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { buscarPorId } = require('../models/usuarioModel');
    const user = await buscarPorId(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
