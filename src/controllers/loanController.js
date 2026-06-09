import Loan from '../models/Loan.js';
import Book from '../models/Book.js';
import mongoose from 'mongoose';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getLoans = async (req, res) => {
  try {
    const { status, genre } = req.query;
    const filter = {};
    if (status) filter.estado = status;

    let loans = await Loan.find(filter)
      .populate({ path: 'book', populate: { path: 'author' } })
      .populate('reader')
      .sort({ fechaPrestamo: -1 });

    if (genre) {
      loans = loans.filter((loan) => loan.book && loan.book.genero === genre);
    }

    res.json({ success: true, count: loans.length, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLoanById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'ID no válido' });
    }

    const loan = await Loan.findById(req.params.id)
      .populate({ path: 'book', populate: { path: 'author' } })
      .populate('reader');

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
    }

    res.json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLoan = async (req, res) => {
  try {
    const { book: bookId, reader: readerId, fechaPrestamo, fechaDevolucionEsperada, notas } = req.body;

    const activeLoans = await Loan.countDocuments({ reader: readerId, estado: 'active' });
    if (activeLoans >= 3) {
      return res.status(409).json({
        success: false,
        message: 'El lector ya tiene 3 préstamos activos. No puede tener más.',
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    }
    if (book.copiasDisponibles < 1) {
      return res.status(409).json({ success: false, message: 'No hay copias disponibles de este libro' });
    }

    const loan = await Loan.create({ book: bookId, reader: readerId, fechaPrestamo, fechaDevolucionEsperada, notas });

    await Book.findByIdAndUpdate(bookId, { $inc: { copiasDisponibles: -1 } });

    res.status(201).json({ success: true, data: loan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateLoanStatus = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'ID no válido' });
    }

    const { estado } = req.body;
    const validStatuses = ['active', 'returned', 'overdue'];

    if (!estado || !validStatuses.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: `El estado debe ser uno de: ${validStatuses.join(', ')}`,
      });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
    }

    const wasActive = loan.estado === 'active';
    const isNowReturned = estado === 'returned';

    const updateData = { estado };
    if (isNowReturned && wasActive) {
      updateData.fechaDevuelto = new Date();
    }

    const updated = await Loan.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate({ path: 'book', populate: { path: 'author' } })
      .populate('reader');

    if (isNowReturned && wasActive) {
      await Book.findByIdAndUpdate(loan.book, { $inc: { copiasDisponibles: 1 } });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};