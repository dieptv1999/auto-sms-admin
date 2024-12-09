import {CartesianGrid, LabelList, Line, LineChart, XAxis} from "recharts"

import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {AxiosResponse, HttpStatusCode} from "axios";
import {RepositoryFactory} from "@/api/repository-factory.ts";
import {memo, useEffect, useState} from "react";

const UserRepository = RepositoryFactory.get('user')

const chartConfig = {
    cnt: {
        label: "Số người dùng",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export const UserPerDayOverview = memo(() => {
    const [data, setData] = useState<any[]>([])
    const fetchData = () => {
        UserRepository.statisticByDay('day').then((rsp: AxiosResponse) => {
            if (rsp.status === HttpStatusCode.Ok) {
                setData(rsp.data);
            }
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Biểu đồ số lượng người dùng đăng ký theo ngày</CardTitle>
                {/*<CardDescription>January - June 2024</CardDescription>*/}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className={'h-[350px] w-full'}>
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            style={{
                                marginTop: 8,
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Line
                            dataKey="cnt"
                            type="natural"
                            stroke="var(--color-cnt)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-desktop)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Line>
                    </LineChart>
                </ChartContainer>
            </CardContent>
            {/*<CardFooter className="flex-col items-start gap-2 text-sm">*/}
            {/*    <div className="flex gap-2 font-medium leading-none">*/}
            {/*        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />*/}
            {/*    </div>*/}
            {/*    <div className="leading-none text-muted-foreground">*/}
            {/*        Showing total visitors for the last 6 months*/}
            {/*    </div>*/}
            {/*</CardFooter>*/}
        </Card>
    )
})
