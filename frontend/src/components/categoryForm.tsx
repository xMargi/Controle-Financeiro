import { useEffect, useState } from "react";
import type { CategoriesData } from "./categoryList";
import { instance } from "../services/axios";
import "../styles/categories/categories-form.css";

interface categoryFormProps {
    onCategorieCreated: (categorie: CategoriesData | null) => void;
    onCategorieUpdated: (categorie: CategoriesData) => void;
    categorieToEdit: CategoriesData | null;
}

export const CategoryForm = ({ onCategorieCreated, onCategorieUpdated, categorieToEdit }: categoryFormProps) => {
    const [name, setName] = useState<string>("")
    const [type, setType] = useState<string>("Despesa")

    const onSubmit = async () => {
        try {
            if (categorieToEdit) {
                const updatedCategory = await instance.put(`/categories/updateCategories/${categorieToEdit.id}`, { name, type });
                if (updatedCategory.data) {
                    onCategorieUpdated({ ...categorieToEdit, name, type });
                }
            } else {
                await instance.post(`/categories/createCategorie`, { name, type });
                onCategorieCreated(null);
                setName("");
                setType("Despesa");
            }


        } catch {
            void 0;
        }
    }

    useEffect(() => {
        let mounted = true;

        if (categorieToEdit !== null && mounted) {
            queueMicrotask(() => {
                setName(categorieToEdit.name);
                setType(categorieToEdit.type);
            });
        }

        return () => { mounted = false; };
    }, [categorieToEdit]);

    return (
        <div className="category-form-container">
            <h3 className="category-form-header">Nova Categoria</h3>

            <div className="form-group">
                <label className="form-label" htmlFor="nameCategorie">Nome da categoria</label>
                <input
                    className="form-input"
                    type="text"
                    id="nameCategorie"
                    value={name}
                    placeholder="Ex: Mercado"
                    onChange={e => setName(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="type">Tipo</label>
                <select
                    className="form-select"
                    name="type"
                    id="type"
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    <option value="Despesa">Despesa</option>
                    <option value="Receita">Receita</option>
                </select>
            </div>

            <button className="form-submit-btn" onClick={onSubmit}>
                {categorieToEdit ? "Atualizar" : "Criar"}
            </button>
        </div>
    )
}
