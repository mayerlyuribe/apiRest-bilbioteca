import { Router } from 'express';
import { check } from 'express-validator';
import {
  getLoans,
  getLoanById,
  createLoan,
  updateLoanStatus,
} from '../controllers/loanController.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.get('/', validarJWT, getLoans);

router.post('/',
  validarJWT,
  check('fechaPrestamo', 'La fecha de préstamo es obligatoria').not().isEmpty().isISO8601().toDate(),
  check('fechaDevolucionEsperada', 'La fecha de devolución es obligatoria').not().isEmpty().isISO8601().toDate(),
  check('book', 'El ID del libro no es válido').isMongoId(),
  check('reader', 'El ID del lector no es válido').isMongoId(),
  validarCampos,
  createLoan
);

router.patch('/:id/status',
  validarJWT,
  check('estado', 'El estado debe ser active, returned u overdue').isIn(['active', 'returned', 'overdue']),
  validarCampos,
  updateLoanStatus
);

router.get('/:id', validarJWT, getLoanById);

export default router;