import type { Request, Response } from 'express';

export const login = (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Aquí iría tu lógica de validación con la base de datos
    if (email === "usuario@ejemplo.com" && password === "123456") {
        return res.status(200).json({ message: "Inicio de sesión exitoso" });
    }

    return res.status(401).json({ message: "Credenciales incorrectas" });
};