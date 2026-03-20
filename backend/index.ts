import express, { type Request, type Response } from "express";
import cors from 'cors'
import 'dotenv/config';
import authRouter from "./src/routes/authRoutes/authRoutes.js"
import categoriesRouter from "./src/routes/categoriesRoutes/categoriesRoutes.js"
import transactionsRouter from "./src/routes/transactionsRoutes/transactionsRoutes.js"
import dashboardRouter from "./src/routes/dashboardRoutes/dashboardRoutes.js"


const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/categories", categoriesRouter);
app.use("/transactions", transactionsRouter);
app.use("/dashboard", dashboardRouter)

process.on('uncaughtException', (err) => console.error('Erro:', err))
process.on('unhandledRejection', (err) => console.error('Rejeição:', err))

app.listen(PORT || 3000, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
})