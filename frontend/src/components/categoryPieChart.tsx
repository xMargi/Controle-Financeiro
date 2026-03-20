"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card"
import {
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "./ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"
import { instance } from "../services/axios"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"

interface ChartData {
    id: number,
    category: string,
    value: number,
    fill: string
}

interface ChartItem {
    id: number,
    name: string,
    sum: string | number,
}

interface ChartPieInteractiveProps {
    refreshTrigger?: number
}

const COLORS = [
    "#8b5cf6", // violet-500
    "#3b82f6", // blue-500
    "#ec4899", // pink-500
    "#f59e0b", // amber-500
    "#10b981", // emerald-500
    "#6366f1", // indigo-500
]

type TransacaoTipo = "Receita" | "Despesa";

export function ChartPieInteractive({ refreshTrigger = 0 }: ChartPieInteractiveProps) {
    const id = "pie-interactive"
    const [activeId, setActiveId] = React.useState<string>("")
    const [chartData, setChartData] = React.useState<ChartData[]>([])
    const [type, setType] = React.useState<TransacaoTipo>("Despesa")

    const searchCategoryExpenses = () => {
        instance.get(`/dashboard/getCategoryExpenses?type=${type}`).then(res => {
            if (!res.data || res.data.length === 0) {
                setChartData([])
                return
            }
            const filteredData = res.data
                .map((item: ChartItem, index: number) => ({
                    id: item.id,
                    category: item.name,
                    value: Number(item.sum),
                    fill: COLORS[index % COLORS.length]
                }))
                .filter((item: ChartData) => item.value > 0) // Only show categories with actual money for the pie

            setChartData(filteredData)

            if (filteredData.length > 0 && (!activeId || !filteredData.find((d: ChartData) => d.id.toString() === activeId))) {
                setActiveId(filteredData[0].id.toString())
            }
        }).catch(() => setChartData([]))
    }

    React.useEffect(() => {
        searchCategoryExpenses()
    }, [refreshTrigger, type])

    const chartConfig = React.useMemo(() => {
        return chartData.reduce((config, item) => {
            config[item.id.toString()] = {
                label: item.category,
                color: item.fill
            }
            return config
        }, {} as ChartConfig)
    }, [chartData])

    const activeIndex = React.useMemo(
        () => chartData.findIndex((item) => item.id.toString() === activeId),
        [activeId, chartData]
    )
    const activeItem = chartData[activeIndex]

    return (
        <Card data-chart={id} className="flex flex-col bg-transparent border-none shadow-none w-full">
            <ChartStyle id={id} config={chartConfig} />
            <CardHeader className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 p-0 pb-6 gap-4">
                <div className="grid gap-1">
                    <CardTitle className="text-white flex items-center gap-2">
                        Resumo por Categoria
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        {type === "Despesa" ? "Distribuição de gastos" : "Distribuição de ganhos"}
                    </CardDescription>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    {/* Toggle de Tipo */}
                    <Select value={type} onValueChange={(val: TransacaoTipo ) => setType(val)}>
                        <SelectTrigger className="h-9 w-[120px] bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-[#0a0a0a] border-white/10 text-white rounded-xl">
                            <SelectItem value="Despesa">Despesas</SelectItem>
                            <SelectItem value="Receita">Receitas</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Seletor de Categoria */}
                    {chartData.length > 0 && (
                        <Select value={activeId} onValueChange={setActiveId}>
                            <SelectTrigger
                                className="h-9 w-[150px] bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                                aria-label="Selecionar categoria"
                            >
                                <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent
                                position="popper"
                                align="end"
                                className="bg-[#0a0a0a] border-white/10 text-white shadow-2xl min-w-[160px] rounded-xl"
                            >
                                {chartData.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={item.id.toString()}
                                        className="cursor-pointer focus:bg-white/10"
                                    >
                                        <div className="flex items-center gap-2 text-xs py-1">
                                            <span
                                                className="h-2 w-2 shrink-0 rounded-full"
                                                style={{ backgroundColor: item.fill }}
                                            />
                                            <span>{item.category}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center p-0">
                {chartData.length > 0 ? (
                    <ChartContainer
                        id={id}
                        config={chartConfig}
                        className="mx-auto aspect-square w-full max-w-[300px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="id"
                                innerRadius={70}
                                outerRadius={90}
                                strokeWidth={2}
                                stroke="rgba(0,0,0,0.1)"
                                activeIndex={activeIndex}
                                activeShape={({
                                    outerRadius = 0,
                                    ...props
                                }: PieSectorDataItem) => (
                                    <g>
                                        <Sector {...props} outerRadius={outerRadius + 8} />
                                        <Sector
                                            {...props}
                                            outerRadius={outerRadius + 15}
                                            innerRadius={outerRadius + 10}
                                        />
                                    </g>
                                )}
                                className="outline-none"
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            const activeValue = activeItem?.value || 0
                                            const activeName = activeItem?.category || ""
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-white text-2xl font-bold"
                                                    >
                                                        {activeValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-gray-400 text-xs font-medium"
                                                    >
                                                        {activeName}
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">
                        Nenhum dado encontrado para este tipo.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
