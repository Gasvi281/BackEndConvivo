const multer = require('multer');
const path   = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

const MAX_TAMAÑO  = 20 * 1024 * 1024;
const MAX_ARCHIVOS = 5;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'comentarios',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'mp4', 'mov', 'doc', 'docx']
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_TAMAÑO,
    files: MAX_ARCHIVOS,
  },
});

module.exports = upload;