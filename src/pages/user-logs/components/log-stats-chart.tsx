import {Bar, BarChart, LabelList, XAxis} from "recharts"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {memo} from "react"

const chartConfig = {
    cnt: {
        label: "Order count",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export const LogStatsChart = memo(({chartData}: {chartData: any[]}) => {
    return (
        <div className="my-2">
            <ChartContainer config={chartConfig} className={'h-[150px] w-full'}>
                <BarChart accessibilityLayer data={chartData}>
                    {/* <CartesianGrid vertical={false} /> */}
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="cnt" fill="var(--color-cnt)" radius={8}>
                        <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={10}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    )
})