"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart"
import { instance } from "../services/axios"

interface MonthlyData {
  mes: string
  totalreceitas: string | number
  totaldespesas: string | number
}

const chartConfig = {
  receitas: {
    label: "Receitas",
    color: "var(--color-cyan-400)",
  },
  despesas: {
    label: "Despesas",
    color: "var(--color-rose-400)",
  },
} satisfies ChartConfig

interface MonthlyFlowChartProps {
  refreshTrigger?: number
}

export function MonthlyFlowChart({ refreshTrigger = 0 }: MonthlyFlowChartProps) {
  const [data, setData] = React.useState<any[]>([])

  const fetchMonthlyFlow = async () => {
    try {
      const response = await instance.get("/dashboard/getMonthlyFlow")
      const formattedData = response.data.map((item: MonthlyData) => {
        const date = new Date(item.mes)
        return {
          month: date.toLocaleDateString("pt-BR", { month: "short" }),
          receitas: Number(item.totalreceitas) || 0,
          despesas: Number(item.totaldespesas) || 0,
        }
      })
      setData(formattedData)
    } catch (error) {
      console.error("Erro ao carregar fluxo mensal", error)
    }
  }

  React.useEffect(() => {
    fetchMonthlyFlow()
  }, [refreshTrigger])

  return (
    <Card className="bg-transparent border-none shadow-none w-full">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-white">Fluxo de Caixa Mensal</CardTitle>
        <CardDescription className="text-gray-400">Comparativo de receitas e despesas (Últimos 6 meses)</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              stroke="rgba(255,255,255,0.3)"
            />
            <YAxis 
                hide 
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar 
              dataKey="receitas" 
              fill="#22d3ee" // cyan-400
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
            <Bar 
              dataKey="despesas" 
              fill="#fb7185" // rose-400
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
