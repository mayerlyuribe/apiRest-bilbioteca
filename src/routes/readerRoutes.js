import { Router } from 'express';
import { check } from 'express-validator';
import {
  getReaders,
  getReaderById,
  createReader,
  updateReader,
  deleteReader,
} from '../controllers/readerController.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.route('/')
  .get(validarJWT, getReaders)
  .post([
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty().trim(),
    check('email', 'El email no es válido').isEmail().normalizeEmail(),
    check('membresia', 'La membresía debe ser standard o premium').isIn(['standard', 'premium']),
    validarCampos,
  ], createReader);

router.route('/:id')
  .get(validarJWT, getReaderById)
  .put([
    validarJWT,
    check('email', 'El email no es válido').optional().isEmail().normalizeEmail(),
    check('membresia', 'La membresía debe ser standard o premium').optional().isIn(['standard', 'premium']),
    validarCampos,
  ], updateReader)
  .delete(validarJWT, deleteReader);

export default router;