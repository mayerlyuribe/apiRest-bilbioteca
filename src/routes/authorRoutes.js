import { Router } from 'express';
import { check } from 'express-validator';
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from '../controllers/authorController.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.route('/')
  .get(validarJWT, getAuthors)
  .post([
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty().trim(),
    check('fechaNacimiento', 'Formato de fecha inválido').optional().isISO8601().toDate(),
    validarCampos,
  ], createAuthor);

router.route('/:id')
  .get(validarJWT, getAuthorById)
  .put([
    validarJWT,
    check('nombre', 'El nombre es obligatorio').optional().not().isEmpty().trim(),
    check('fechaNacimiento', 'Formato de fecha inválido').optional().isISO8601().toDate(),
    validarCampos,
  ], updateAuthor)
  .delete(validarJWT, deleteAuthor);

export default router;