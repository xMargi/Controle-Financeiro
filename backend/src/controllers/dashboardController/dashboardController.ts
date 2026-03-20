import type { Response } from "express";
import type { RequestWithUser } from "../../types/express.js";
import pool from "../../db/index.js";

const getSummary = async (req: RequestWithUser, res: Response) => {
    const userEmail = req.userEmail;

    try {
        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail])
        if (findUser.rows.length === 0) return res.status(404).json({ message: "Nenhum usuário encontrado!" });

        const allTransactionsRevenue = await pool.query("SELECT SUM(value) FROM transactions WHERE type = 'Receita' AND users_id = $1", [findUser.rows[0].id])

        const allTransactionsExpenses = await pool.query("SELECT SUM(value) FROM transactions WHERE type = 'Despesa' AND users_id = $1", [findUser.rows[0].id])

        const revenue = allTransactionsRevenue.rows[0].sum;
        const expenses = allTransactionsExpenses.rows[0].sum;

        const balance = revenue - expenses

        return res.status(200).json({ revenue, expenses, balance })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro interno no servidor!" });
    }
}

const getCategoryExpenses = async (req: RequestWithUser, res: Response) => {
    const userEmail = req.userEmail;
    const { type = "Despesa" } = req.query;

    try {
        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail])
        if (findUser.rows.length === 0) return res.status(404).json({ message: "Nenhum usuário encontrado!" });

        const getExpensesByCategory = await pool.query(
            "SELECT categories.id, categories.name, COALESCE(SUM(transactions.value), 0) AS sum FROM categories LEFT JOIN transactions ON categories.id = transactions.categories_id AND transactions.type = $1 WHERE categories.users_id = $2 GROUP BY categories.id, categories.name",
            [type, findUser.rows[0].id]
        )

        const arrExpensesByCategory = getExpensesByCategory.rows

        return res.status(200).json(arrExpensesByCategory)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro interno no servidor!" });
    }
}

const getMonthlyFlow = async (req: RequestWithUser, res: Response) => {
    const userEmail = req.userEmail

    try {
        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail])
        if (findUser.rows.length === 0) return res.status(404).json({ message: "Nenhum usuário encontrado!" });

        const getSumRevenueAndExpenses = await pool.query("SELECT date_trunc('month', date) AS mes, SUM (value) FILTER (WHERE type = 'Receita') AS totalReceitas, SUM (value) FILTER (WHERE type = 'Despesa') AS totalDespesas FROM transactions WHERE users_id = $1 AND date >= NOW() - INTERVAL '6 months' GROUP BY mes ORDER BY mes", [findUser.rows[0].id])

        const arrRevenueAndExpenses = getSumRevenueAndExpenses.rows

        return res.status(200).json(arrRevenueAndExpenses)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro interno no servidor!" });
    }
}

export {getSummary, getCategoryExpenses, getMonthlyFlow}