import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Expense, MonthlyCategoryStats, Preferences } from "@/types"
import { formatAmount } from "@/lib/data"
import useCurrencySymbol from "@/hooks/use-currency-symbol"

interface ExpensesDistributionChartProps{
    stats : MonthlyCategoryStats,
    amount : number,
    totalExpenses : number,
    preferences : Preferences
}

interface CategoryData{
    name : string,
    amount : number,
    fill : string,
}

export function ExpensesPerCategoryDistributionSection({totalExpenses, stats, amount, preferences} : ExpensesDistributionChartProps) {
    const [canRenderChart, setCanRenderChart] = React.useState(false)
    const currencySymbol = useCurrencySymbol(preferences.currency);

    React.useEffect(() => {
        if (totalExpenses > 0) {
            const timeout = setTimeout(() => {
            setCanRenderChart(true)
            }, 400)

            return () => clearTimeout(timeout)
        } else {
            setCanRenderChart(false)
        }
    }, [])

  return (
    <div className="mt-12">
        <h2 className="text-muted-foreground text-sm font-bold">Distribution des dépenses mensuelles</h2>
        <Card className="flex h-[250px] flex-row items-center bg-white mt-2 shadow-xl border-none relative pr-2">
            <CardContent className="flex-1 pb-0 px-0 relative z-20">
                {canRenderChart && stats.data.length > 0 &&
                <ChartContainer
                config={stats.config}
                className="aspect-square h-[200px]"
                >
                    <PieChart>
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                        data={stats.data}
                        dataKey="amount"
                        nameKey="name"
                        cornerRadius={10}
                        innerRadius={60}
                        strokeWidth={5}
                        paddingAngle={1}
                        isAnimationActive={true}    
                        key={stats.data.map(d => d.name).join("-")}
                        >
                        <Label
                            content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                <>
                                
                                <circle cy={viewBox.cy} cx={viewBox.cx} r={50} className="shadow-xl fill-white">

                                </circle>
                                <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    color="red"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-3xl font-black"
                                    >
                                    {totalExpenses.toLocaleString()}
                                    </tspan>
                                    <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground"
                                    >
                                    Dépenses
                                    </tspan>
                                </text>
                                </>
                                )
                            }
                            }}
                        />
                        </Pie>
                    </PieChart>
                </ChartContainer>
                
                }
            
                {
                    !canRenderChart && 
                    <div className="h-[250px] aspect-square flex items-center justify-center flex-col p-4">
                    </div>
                }
            </CardContent>
            {
                canRenderChart && stats.data.length > 0 &&
                <div className=" flex-1 pr-6 max-w-[180px] overflow-y-auto h-full flex items-start max-h-[180px]">
                    <ul className="flex flex-col gap-4  relative z-10">
                    {
                        stats.data.map((data, index) => (
                            <li key={index} style={{transitionDelay : `${index*650/stats.data.length + 400}ms`}} className={`text-xs flex flex-col gap-1 items-end justify-center transition-all duration-400 opacity-100 starting:opacity-0 translate-y-0 starting:translate-y-2`}>
                                <div className="flex items-center gap-2">
                                    <div style = {{backgroundColor : data.fill}} className={`w-4 h-4 rounded-sm`}></div>
                                    <span className="text-muted-foreground">{data.name}</span>
                                </div>
                                
                                <span className="font-bold ">{formatAmount(Number(data.amount), preferences.number_format)} {currencySymbol}</span>
                            </li>
                        ))
                    }
                    </ul>
                </div>
            }
        </Card>
    </div>
  )
}
