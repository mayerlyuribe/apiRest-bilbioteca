import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema(
  {
    fechaPrestamo: {
      type: Date,
      required: [true, 'La fecha de préstamo es obligatoria'],
    },
    fechaDevolucionEsperada: {
      type: Date,
      required: [true, 'La fecha de devolución esperada es obligatoria'],
    },
    fechaDevuelto: {
      type: Date,
      default: null,
    },
    estado: {
      type: String,
      enum: ['active', 'returned', 'overdue'],
      default: 'active',
    },
    notas: {
      type: String,
      trim: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'El préstamo debe estar asociado a un libro'],
    },
    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reader',
      required: [true, 'El préstamo debe estar asociado a un lector'],
    },
  },
  { timestamps: true }
);

loanSchema.pre('validate', function () {
  if (
    this.fechaDevolucionEsperada &&
    this.fechaPrestamo &&
    this.fechaDevolucionEsperada <= this.fechaPrestamo
  ) {
    this.invalidate(
      'fechaDevolucionEsperada',
      'La fecha de devolución esperada debe ser posterior a la fecha de préstamo'
    );
  }
});

export default mongoose.model('Loan', loanSchema);