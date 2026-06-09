import { Router } from 'express';
import { check } from 'express-validator';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookAvailability,
} from '../controllers/bookController.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.route('/')
  .get(validarJWT, getBooks)
  .post([
    validarJWT,
    check('titulo', 'El título es obligatorio').not().isEmpty().trim(),
    check('isbn', 'El ISBN es obligatorio').not().isEmpty().trim(),
    check('genero', 'Género inválido').isIn(['fiction', 'non-fiction', 'sci-fi', 'history', 'other']),
    check('copiasDisponibles', 'Las copias deben ser un número entero').isInt({ min: 0 }),
    check('author', 'El ID del autor no es válido').isMongoId(),
    validarCampos,
  ], createBook);

router.get('/:id/availability', validarJWT, getBookAvailability);

router.route('/:id')
  .get(validarJWT, getBookById)
  .put([
    validarJWT,
    check('genero', 'Género inválido').optional().isIn(['fiction', 'non-fiction', 'sci-fi', 'history', 'other']),
    check('copiasDisponibles', 'Las copias deben ser un número entero').optional().isInt({ min: 0 }),
    check('author', 'El ID del autor no es válido').optional().isMongoId(),
    validarCampos,
  ], updateBook)
  .delete(validarJWT, deleteBook);

export default router;