import { useEffect, useState } from "react"
import type { TransactionData } from "./transactionForm";
import type { CategoriesData } from "./categoryList";
import { instance } from "../services/axios";
import { RefreshCcw, X } from "lucide-react";
import "../styles/categories/categories.css";
import { TransactionForm } from "./transactionForm";

interface TransactionListProps {
    categoriesRefreshTrigger: number;
    onTransactionChanged: () => void;
}

export const TransactionList = ({
    categoriesRefreshTrigger,
    onTransactionChanged
}: TransactionListProps) => {
    const [transactionsList, setTransactionsList] = useState<TransactionData[]>([]);
    const [transactionToEdit, setTransactionToEdit] = useState<TransactionData | null>(null);
    const [categoriesList, setCategoriesList] = useState<CategoriesData[]>([]);

    const searchCategories = () => {
        instance.get("/categories/readCategories")
            .then(res => setCategoriesList(res.data))
            .catch(err => {
                const error = err as { response?: { status: number } };
                if (error.response?.status === 404) setCategoriesList([])
            })
    }

    const searchTransaction = () => {
        instance.get("/transactions/readTransaction").then(res => {
            setTransactionsList(res.data)
        }).catch(err => {
            const error = err as { response?: { status: number } };
            if (error.response?.status === 404) {
                setTransactionsList([]);
            }
        })
    }

    useEffect(() => {
        searchCategories();
        searchTransaction();
    }, [])

    useEffect(() => {
        searchCategories()
    }, [categoriesRefreshTrigger])


    const addTransaction = () => {
        searchTransaction();
        onTransactionChanged();
    }

    const initUpdate = (transaction: TransactionData) => {
        setTransactionToEdit(transaction)
    }

    const updateTransaction = () => {
        setTransactionToEdit(null);
        searchTransaction();
        onTransactionChanged();
    }

    const deleteTransaction = async (id: number) => {
        try {
            await instance.delete(`/transactions/deleteTransaction/${id}`)
            searchTransaction();
            onTransactionChanged();
        } catch (error) {
            console.error("Erro ao deletar transação:", error);
        }
    }

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 min-w-[300px]">
                <TransactionForm
                    onTransactionCreated={addTransaction}
                    onTransactionUpdated={updateTransaction}
                    transactionToEdit={transactionToEdit}
                    categoriesRefreshTrigger={categoriesRefreshTrigger}
                />
            </div>

            <div className="w-full md:w-2/3">
                <div className="categories-container">
                    <h2 className="categories-header">
                        Minhas Transações
                    </h2>
                    <ul className="categories-list">
                        {transactionsList.map((transaction, index) =>
                            <li key={transaction.id} className="category-item transaction-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                <span className="category-id">{transaction.id}</span>
                                <div className="transaction-info">
                                    <span className="category-name transaction-title">{transaction.description} | R$ {Number(transaction.value).toFixed(2)}</span>
                                    <span className="transaction-subtitle">
                                        {transaction.date ? new Date(transaction.date).toLocaleDateString('pt-BR') : ''} • {categoriesList.find(c => c.id === transaction.categories_id)?.name || 'Sem Categoria'}
                                    </span>
                                </div>
                                <button className="category-button delete" onClick={() => deleteTransaction(transaction.id)}><X /></button>
                                <button className="category-button update" onClick={() => initUpdate(transaction)}><RefreshCcw className="w-[92%]" /></button>
                                <span className="category-type" data-type={transaction.type}>
                                    {transaction.type}
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}