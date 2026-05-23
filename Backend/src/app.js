const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// Rutas
const authRoutes = require('./routes/authRoutes');
const rolRoutes = require('./routes/rolRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const autorRoutes = require('./routes/autorRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const libroRoutes = require('./routes/libroRoutes');
const libroAutorRoutes = require('./routes/libroAutorRoutes');
const libroCategoriaRoutes = require('./routes/libroCategoriaRoutes');
const descargaRoutes = require('./routes/descargaRoutes');
const visualizacionRoutes = require('./routes/visualizacionRoutes');
const actividadRoutes = require('./routes/actividadRoutes');
const calificacionRoutes = require('./routes/calificacionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/autores', autorRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/libros', libroRoutes);
app.use('/api/libro-autor', libroAutorRoutes);
app.use('/api/libro-categoria', libroCategoriaRoutes);
app.use('/api/descargas', descargaRoutes);
app.use('/api/visualizaciones', visualizacionRoutes);
app.use('/api/actividad', actividadRoutes);
app.use('/api/calificaciones', calificacionRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'BiblioTech API funcionando correctamente' });
});

module.exports = app;
