import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    nacionalidad: {
      type: String,
      trim: true,
    },
    fechaNacimiento: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Author', authorSchema);