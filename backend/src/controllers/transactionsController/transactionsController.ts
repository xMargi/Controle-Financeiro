import type { Response } from "express";
import type { RequestWithUser } from "../../types/express.js";
import pool from "../../db/index.js";

const createTransaction = async (req: RequestWithUser, res: Response) => {
    const userEmail = req.userEmail;
    const { description, value, type, date, categories_id } = req.body;

    try {
        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail])
        if (findUser.rows.length === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        const idUser = findUser.rows[0].id;

        if (type !== "Receita" && type !== "Despesa") return res.status(400).json({ message: "O tipo precisa ser Receita ou Despesa" });

        const findCategorie = await pool.query("SELECT * FROM categories WHERE id = $1 AND users_id = $2", [categories_id, idUser])
        if (findCategorie.rows.length == 0) return res.status(404).json({ message: "Categoria não encontrada!" });
        const categorieId = findCategorie.rows[0].id

        await pool.query("INSERT INTO transactions (description, value, type, date, categories_id, users_id) VALUES ($1, $2, $3, $4, $5, $6)", [description, value, type, date, categorieId, idUser]);

        res.status(201).json({ message: "Sucesso ao criar transação" });

    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor!" });
    }
}

const readTransaction = async (req: RequestWithUser, res: Response) => {
    try {
        const userEmail = req.userEmail;

        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail])
        if (findUser.rows.length === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        const idUser = findUser.rows[0].id;

        const allTransactions = await pool.query("SELECT * FROM transactions WHERE users_id = $1", [idUser]);
        if (allTransactions.rows.length === 0) return res.status(404).json({ message: "Nenhuma transação encontrada!" });


        return res.status(200).json(allTransactions.rows)

    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor!" });
    }
}

const updateTransaction = async (req: RequestWithUser, res: Response) => {
    try {
        const userEmail = req.userEmail;
        const { id } = req.params;
        const { description, value, type, date, categories_id } = req.body;

        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail])
        if (findUser.rows.length === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        const idUser = findUser.rows[0].id;

        if (type !== "Receita" && type !== "Despesa") return res.status(400).json({ message: "O tipo precisa ser Receita ou Despesa" });

        const findTransaction = await pool.query("SELECT * FROM transactions WHERE id = $1 AND categories_id = $2 AND users_id = $3", [id, categories_id, idUser]);
        if (findTransaction.rows.length === 0) return res.status(404).json({ message: "Nenhuma transação encontrada!" });

        await pool.query("UPDATE transactions SET description = $1, value = $2, type = $3, date = $4 WHERE id = $5", [description, value, type, date, findTransaction.rows[0].id]);

        return res.status(200).json({ message: "Transação atualizada com sucesso!" });

    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor!" });
    }
}

const deleteTransaction = async (req: RequestWithUser, res: Response) => {
    const userEmail = req.userEmail
    const { id } = req.params
    try {

        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail])
        if (findUser.rows.length === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        const idUser = findUser.rows[0].id;

        const findTransaction = await pool.query("SELECT * FROM transactions WHERE id = $1 AND users_id = $2", [id, idUser]);
        if (findTransaction.rows.length === 0) return res.status(404).json({ message: "Nenhuma transação encontrada!" });

        await pool.query("DELETE FROM transactions WHERE id = $1", [id]);

        return res.status(200).json({ message: "Transação removida com sucesso!" });

    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor!" });
    }

}

export { createTransaction, readTransaction, updateTransaction, deleteTransaction };