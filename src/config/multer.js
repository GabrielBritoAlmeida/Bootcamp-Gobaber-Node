import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

// Configuração do Multer
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'upload'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        // extname retorna apenas a extenção do arquivo
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
