import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Token inválido ou não fornecido" });

        jwt.verify(token, process.env.SECRETWORD!, (err, decoded) => {
            if (err) return res.status(401).json({ message: "Erro ao decodificar o token" });
            (req as any).userEmail = (decoded as any).email
            next();
        })
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor!" })
    }
}

export default verifyToken