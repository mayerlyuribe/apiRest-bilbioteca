import mongoose from 'mongoose';

const readerSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    membresia: {
      type: String,
      enum: ['standard', 'premium'],
      required: [true, 'La membresía es obligatoria'],
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Reader', readerSchema);