import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'El ISBN es obligatorio'],
      unique: true,
      trim: true,
    },
    genero: {
      type: String,
      enum: ['fiction', 'non-fiction', 'sci-fi', 'history', 'other'],
      required: [true, 'El género es obligatorio'],
    },
    anio: {
      type: Number,
    },
    copiasDisponibles: {
      type: Number,
      required: [true, 'Las copias disponibles son obligatorias'],
      min: [0, 'Las copias no pueden ser negativas'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'El libro debe tener un autor'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);