import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generarJWT } from '../middlewares/validar-jwt.js';

export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const user = await User.create({ nombre, email, password, rol });
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    const token = await generarJWT(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ success: true, data: userResponse, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};