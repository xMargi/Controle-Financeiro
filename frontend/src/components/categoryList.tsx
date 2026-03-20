import { useEffect, useState } from "react"
import { instance } from "../services/axios";
import "../styles/categories/categories.css";
import { RefreshCcw, X } from "lucide-react";
import { CategoryForm } from "./categoryForm";

export interface CategoriesData {
    id: number;
    name: string;
    type: string;
    users_id: number;
}

interface CategoriesListProps {
    onCategorieCreated: () => void;
}

export const Categories = ({
    onCategorieCreated
}: CategoriesListProps) => {

    const [categoriesList, setCategoriesList] = useState<CategoriesData[]>([]);
    const [updateCategoriesList, setUpdateCategoriesList] = useState<CategoriesData | null>(null);
    const searchData = () => {
        instance.get(`/categories/readCategories`)
            .then(response => {
                setCategoriesList(response.data);
            })
            .catch((err) => {
                const error = err as { response?: { status: number } };
                if (error.response?.status === 404) {
                    setCategoriesList([]);
                }
            });
    }

    useEffect(() => {
        searchData();
    }, [])

    const addCategory = () => {
        searchData();
        onCategorieCreated()
    }

    const initUpdate = (category: CategoriesData) => {
        setUpdateCategoriesList(category);
    }

    const updateCategory = () => {
        setUpdateCategoriesList(null);
        searchData();
    }

    const deleteCategorie = async (id: number) => {
        try {
            await instance.delete(`/categories/deleteCategories/${id}`);
            searchData();
        } catch (error) {
            console.error("Erro ao deletar categoria:", error);
        }
    }

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 min-w-[300px]">
                <CategoryForm
                    onCategorieCreated={addCategory}
                    onCategorieUpdated={updateCategory}
                    categorieToEdit={updateCategoriesList}
                />
            </div>

            <div className="w-full md:w-2/3">
                <div className="categories-container">
                    <h2 className="categories-header">
                        Minhas Categorias
                    </h2>
                    <ul className="categories-list">
                        {categoriesList.map((categorie, index) =>
                            <li key={categorie.id} className="category-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                <span className="category-id">{categorie.id}</span>
                                <span className="category-name">{categorie.name}</span>
                                <button className="category-button delete" onClick={() => deleteCategorie(categorie.id)}><X /></button>
                                <button className="category-button update" onClick={() => initUpdate(categorie)}><RefreshCcw className="w-[92%]" /></button>
                                <span className="category-type" data-type={categorie.type}>
                                    {categorie.type}
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}