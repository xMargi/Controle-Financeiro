import type { Response } from "express";
import type { RequestWithUser } from "../../types/express.js";
import pool from "../../db/index.js";

const createCategorie = async (req: RequestWithUser, res: Response) => {
    const { name, type } = req.body
    const userEmail = req.userEmail;

    try {
        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail])
        if (findUser.rows.length === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        const idUser = findUser.rows[0].id;

        if (type !== "Receita" && type !== "Despesa") return res.status(400).json({ message: "O tipo precisa ser Receita ou Despesa" });

        const createdCateogory = await pool.query("INSERT INTO categories (name, type, users_id) VALUES ($1, $2, $3) RETURNING *", [name, type, idUser])

        return res.status(201).json(createdCateogory.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno no servidor" })
    }

}

const readCategories = async (req: RequestWithUser, res: Response) => {
    const userEmail = req.userEmail;

    try {
        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail])
        if (findUser.rows.length === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        const idUser = findUser.rows[0].id;

        const searchCategoriesById = await pool.query("SELECT * FROM categories WHERE users_id = $1", [idUser]);

        if (searchCategoriesById.rows.length === 0) return res.status(404).json({ message: "Nenhuma categoria encontrada!" })

        res.status(200).json(searchCategoriesById.rows);
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor!" });
    }

}

const updateCategories = async (req: RequestWithUser, res: Response) => {
    const userEmail = req.userEmail;
    const { id } = req.params
    const { name, type } = req.body;

    try {
        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail])
        if (findUser.rows.length === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        const idUser = findUser.rows[0].id;

        const findCategorie = await pool.query("SELECT * FROM categories WHERE id = $1 AND users_id = $2", [id, idUser]);
        if (findCategorie.rows.length === 0) return res.status(404).json({ message: "Categoria não encontrada!" });

        if (type !== "Receita" && type !== "Despesa") return res.status(400).json({ message: "O tipo precisa ser Receita ou Despesa" });

        await pool.query("UPDATE categories SET name = $1, type = $2 WHERE id = $3", [name, type, id]);

        return res.status(200).json({ message: "Categoria atualizada com sucesso!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro interno no servidor!" });
    }

}

const deleteCategories = async (req: RequestWithUser, res: Response) => {
    const userEmail = req.userEmail;
    const { id } = req.params;

    try {
        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail])
        if (findUser.rows.length === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        const idUser = findUser.rows[0].id;

        const findCategorie = await pool.query("SELECT * FROM categories WHERE id = $1 AND users_id = $2", [id, idUser]);
        if (findCategorie.rows.length === 0) return res.status(404).json({ message: "Categoria não encontrada!" })

        const categorieRemoved = await pool.query("DELETE FROM categories WHERE id = $1", [id]);

        return res.status(200).json({ message: "Categoria removida com sucesso!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro interno no servidor!" });
    }

}

export { createCategorie, readCategories, updateCategories, deleteCategories }