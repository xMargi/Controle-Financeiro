import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import pool from "../../db/index.js";
import jwt from "jsonwebtoken"
import "dotenv/config"

const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        await pool.query(`INSERT INTO users(name, email, password_hash) VALUES ($1, $2, $3)`, [name, email, hash]);
        res.status(201).json({ message: "Usuario Criado com sucesso!" });
    } catch (err) {
        res.status(500).json({ message: "Erro interno no servidor!" });
    }
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const findUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
        if (findUser.rows.length != 0) {
            const match = await bcrypt.compare(password, findUser.rows[0].password_hash);
            if (match) {
                const token = jwt.sign({ email }, process.env.SECRETWORD!, {
                    expiresIn: "1d"
                })
                res.status(200).json({ message: "Sucesso ao logar", token })
            }
            else res.status(401).json({ message: "Senha incorreta" })
        } else {
            res.status(404).json({ message: "Usuário não encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "erro interno do sistema" });
    }
}

export { login, register }