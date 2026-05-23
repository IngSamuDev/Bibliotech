const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadRoot = path.join(__dirname, '..', 'uploads');

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

ensureDir(path.join(uploadRoot, 'covers'));
ensureDir(path.join(uploadRoot, 'pdfs'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.fieldname === 'portada' ? 'covers' : 'pdfs';
        const destination = path.join(uploadRoot, folder);
        ensureDir(destination);
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9._-]/g, '');
        cb(null, `${Date.now()}-${safeName}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'portada' && file.mimetype.startsWith('image/')) {
        return cb(null, true);
    }
    if (file.fieldname === 'archivo' && file.mimetype === 'application/pdf') {
        return cb(null, true);
    }
    cb(new Error('Tipo de archivo no permitido'));
};

const uploadBookFiles = multer({
    storage,
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 }
}).fields([
    { name: 'portada', maxCount: 1 },
    { name: 'archivo', maxCount: 1 }
]);

module.exports = { uploadBookFiles };
