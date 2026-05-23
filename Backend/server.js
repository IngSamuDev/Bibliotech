require('dotenv').config();
const app = require('./src/app');
const ensureSchema = require('./src/config/ensureSchema');

const PORT = process.env.PORT || 3000;

ensureSchema()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor listo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error preparando la base de datos:', error);
        process.exit(1);
    });
