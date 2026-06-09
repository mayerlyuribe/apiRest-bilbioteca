import { Router } from "express";
import { check } from "express-validator";
import { register, login } from "../controllers/authController.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
  "/register",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty().trim(),
    check("email", "El email no es válido").isEmail().normalizeEmail(),
    check("password", "El password debe tener al menos 6 caracteres").isLength({
      min: 6,
    }),
    check("rol", "El rol debe ser admin o librarian")
      .optional()
      .isIn(["admin", "librarian"]),
    validarCampos,
  ],
  register,
);

router.post(
  "/login",
  [
    check("email", "El email no es válido").isEmail().normalizeEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  login,
);

export default router;
