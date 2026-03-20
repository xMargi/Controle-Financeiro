import { useState, useEffect } from "react"
import { Categories } from "../components/categoryList"
import { TransactionList } from "../components/transactionList"
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { instance } from "../services/axios"
import { ChartPieInteractive } from "../components/categoryPieChart"
import { MonthlyFlowChart } from "../components/monthlyFlowChart"

export const Dashboard = () => {

    const [categoriesRefreshTrigger, setCategoriesRefreshTrigger] = useState<number>(0);
    const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState<number>(0);
    const [summary, setSummary] = useState({ revenue: 0, expenses: 0, balance: 0 });

    const fetchDashboardSummary = async () => {
        try {
            const response = await instance.get("/dashboard/getSummary");
            const data = response.data;
            setSummary({
                revenue: Number(data.revenue) || 0,
                expenses: Number(data.expenses) || 0,
                balance: Number(data.balance) || 0,
            });
        } catch (error) {
            console.error("Erro ao carregar resumo do dashboard", error);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDashboardSummary();
    }, [categoriesRefreshTrigger, dashboardRefreshTrigger]);

    const onCategorieCreated = () => {
        setCategoriesRefreshTrigger(prev => prev + 1)
    }

    const onTransactionChanged = () => {
        setDashboardRefreshTrigger(prev => prev + 1)
    }
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans selection:bg-emerald-500/30">
            <div className="max-w-[1400px] mx-auto space-y-8">

                {/* Cabeçalho */}
                <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                            <LayoutDashboard className="w-8 h-8 text-gray-400" />
                            Controle Financeiro
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm md:text-base">Acompanhe seus rendimentos, despesas e gerencie seu patrimônio.</p>
                    </div>
                </header>

                {/* Grid de Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Wallet className="w-16 h-16 text-emerald-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Saldo Total</h3>
                        <p className={`text-4xl font-bold mt-2 relative z-10 ${summary.balance < 0 ? 'text-rose-400' : 'text-white'}`}>
                            R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <TrendingUp className="w-16 h-16 text-cyan-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Receitas Totais</h3>
                        <p className="text-4xl font-bold text-cyan-400 mt-2 relative z-10">
                            R$ {summary.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <TrendingDown className="w-16 h-16 text-rose-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Despesas Totais</h3>
                        <p className="text-4xl font-bold text-rose-400 mt-2 relative z-10">
                            R$ {summary.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Area principal de Gestão */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Módulo de Transações */}
                    <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 xl:p-8 backdrop-blur-lg overflow-x-auto">
                        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">Gestão de Transações</h2>
                                <p className="text-sm text-gray-400 mt-1">Adicione despesas e receitas à sua carteira.</p>
                            </div>
                        </div>
                        <div className="mt-4 min-w-full">
                            <TransactionList
                                categoriesRefreshTrigger={categoriesRefreshTrigger}
                                onTransactionChanged={onTransactionChanged}
                            />
                        </div>
                    </section>

                    {/* Módulo de Categorias */}
                    <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 xl:p-8 backdrop-blur-lg overflow-x-auto">
                        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">Configuração de Categorias</h2>
                                <p className="text-sm text-gray-400 mt-1">Crie os marcadores para organizar seu fluxo de caixa.</p>
                            </div>
                        </div>
                        <div className="mt-4 min-w-full">
                            <Categories onCategorieCreated={onCategorieCreated} />
                        </div>
                    </section>
                </div>

                {/* Grid de Gráficos - Posicionado ao final conforme solicitado */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-lg shadow-2xl">
                         <MonthlyFlowChart refreshTrigger={dashboardRefreshTrigger + categoriesRefreshTrigger} />
                    </section>
                    <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-lg shadow-2xl">
                         <ChartPieInteractive refreshTrigger={dashboardRefreshTrigger + categoriesRefreshTrigger} />
                    </section>
                </div>
            </div>
        </div>
    )
}