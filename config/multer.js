const multer = require('multer');
const path   = require('path');
const { v4: uuidv4 } = require('uuid');

// Tipos permitidos
const TIPOS_PERMITIDOS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'video/mp4',
  'video/quicktime',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_TAMAÑO  = 20 * 1024 * 1024; // 20 MB por archivo
const MAX_ARCHIVOS = 5;                 // máximo 5 adjuntos por comentario

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/comentarios/');
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${uuidv4()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (TIPOS_PERMITIDOS.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_TAMAÑO,
    files:    MAX_ARCHIVOS,
  },
});

module.exports = upload;