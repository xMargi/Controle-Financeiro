import { useEffect, useState } from "react"
import type { CategoriesData } from "./categoryList"
import { instance } from "../services/axios"
import "../styles/categories/categories-form.css"

export interface TransactionData {
    id: number,
    description: string,
    value: number,
    type: string,
    date: string,
    categories_id: number,
    users_id: number
}

interface TransactionFormProps {
    onTransactionCreated: (transaction: TransactionData) => void,
    onTransactionUpdated: (transaction: TransactionData) => void,
    transactionToEdit: TransactionData | null,
    categoriesRefreshTrigger: number
}


export const TransactionForm = ({ onTransactionCreated, onTransactionUpdated, transactionToEdit, categoriesRefreshTrigger }: TransactionFormProps) => {
    const [formData, setFormData] = useState({
        description: "",
        value: 0,
        type: "Despesa",
        date: "",
        categories_id: 0
    })
    const [categoriesList, setCategoriesList] = useState<CategoriesData[]>([])


    const searchCategories = () => {
        instance.get("/categories/readCategories")
            .then(res => setCategoriesList(res.data))
            .catch(err => {
                const error = err as { response?: { status: number } };
                if (error.response?.status === 404) setCategoriesList([])
            })
    }

    useEffect(() => {
        searchCategories()
    }, [])

    useEffect(() => {
        searchCategories()
    }, [categoriesRefreshTrigger])

    useEffect(() => {
        let mounted = true;

        if (transactionToEdit && mounted) {
            queueMicrotask(() => {
                setFormData({
                    description: transactionToEdit.description,
                    value: transactionToEdit.value,
                    type: transactionToEdit.type,
                    date: transactionToEdit.date,
                    categories_id: transactionToEdit.categories_id
                });
            });
        }

        return () => { mounted = false; };
    }, [transactionToEdit])


    const onSubmit = async () => {
        if (transactionToEdit) {
            const response = await instance.put(`/transactions/updateTransaction/${transactionToEdit.id}`, formData)
            onTransactionUpdated(response.data);
        } else {
            const response = await instance.post("/transactions/createTransaction", formData);
            onTransactionCreated(response.data);
            setFormData({
                description: "",
                value: 0,
                date: "",
                type: "",
                categories_id: 0
            })
        }
    }

    return (
        <div className="category-form-container">
            <h3 className="category-form-header">Nova Transação</h3>

            <div className="form-group">
                <label className="form-label" htmlFor="description">Descrição</label>
                <input
                    className="form-input"
                    type="text"
                    id="description"
                    value={formData.description}
                    placeholder="Ex: Aluguel"
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="value">Valor</label>
                <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    id="value"
                    value={formData.value || ""}
                    placeholder="Ex: 150.00"
                    onChange={e => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="date">Data</label>
                <input
                    className="form-input"
                    type="date"
                    id="date"
                    value={formData.date ? formData.date.split("T")[0] : ""}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="typeTransaction">Tipo</label>
                <select
                    className="form-select"
                    id="typeTransaction"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                    <option value="" disabled>Selecione um tipo</option>
                    <option value="Despesa">Despesa</option>
                    <option value="Receita">Receita</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="category">Categoria</label>
                <select
                    className="form-select"
                    id="category"
                    value={formData.categories_id || ""}
                    onChange={e => setFormData({ ...formData, categories_id: parseInt(e.target.value) || 0 })}
                >
                    <option value="" disabled>Selecione a categoria</option>
                    {categoriesList.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <button className="form-submit-btn" onClick={onSubmit}>
                {transactionToEdit ? "Atualizar" : "Criar"}
            </button>
        </div>
    )
}