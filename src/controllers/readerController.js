import Reader from '../models/Reader.js';

export const getReaders = async (req, res) => {
  try {
    const readers = await Reader.find();
    res.json({ success: true, data: readers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReaderById = async (req, res) => {
  try {
    const reader = await Reader.findById(req.params.id);
    if (!reader) {
      return res.status(404).json({ success: false, message: 'Lector no encontrado' });
    }
    res.json({ success: true, data: reader });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReader = async (req, res) => {
  try {
    const reader = await Reader.create(req.body);
    res.status(201).json({ success: true, data: reader });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateReader = async (req, res) => {
  try {
    const reader = await Reader.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!reader) {
      return res.status(404).json({ success: false, message: 'Lector no encontrado' });
    }
    res.json({ success: true, data: reader });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteReader = async (req, res) => {
  try {
    const reader = await Reader.findByIdAndDelete(req.params.id);
    if (!reader) {
      return res.status(404).json({ success: false, message: 'Lector no encontrado' });
    }
    res.json({ success: true, message: 'Lector eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};