import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
        expiresIn: process.env.JWT_EXPIRES_IN || "4h",
        },
        (err, token) => {
        if (err) {
            reject("No se pudo generar el token");
        } else {
            resolve(token);
        }
        },
    );
    });
};

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
    return res
        .status(401)
        .json({ success: false, message: "No hay token en la petición" });
    }

    try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await User.findById(uid);
    if (!usuario) {
        return res.status(401).json({
        success: false,
        message: "Token no válido — usuario no existe",
        });
    }

    req.usuario = usuario;
    next();
    } catch (error) {
    res.status(401).json({ success: false, message: "Token no válido" });
    }
};
