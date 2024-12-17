import {Layout} from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import {UserNav} from '@/components/user-nav'
import {DataTable} from './components/data-table'
import {columns} from './components/columns'
import {useEffect, useRef, useState} from "react";
import {PaginationState} from "@tanstack/react-table";
import {useAuth} from "@/context/auth.tsx";
import {throttle} from 'lodash'
import {useParams} from "react-router-dom";
import {RepositoryFactory} from "@/api/repository-factory.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {AxiosResponse} from "axios";
import {LogStatsChart} from "@/pages/message-log/components/log-stats-chart.tsx";

const LogRepository = RepositoryFactory.get('log')

export default function UserActivityPage() {
    const params = useParams()
    const {token} = useAuth()
    const [logs, setLogs] = useState({
        data: [],
        total: 0,
    });
    const [chartData, setChartData] = useState([])
    const page = useRef<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [loading, setLoading] = useState(false)


    const fetchData = throttle((payload?: any) => {
        if (loading) return;
        setLoading(true)
        LogRepository.search({
            page: page.current.pageIndex,
            limit: page.current.pageSize,
            createdBy: params.id,
            ...payload
        })
            .then((resp: AxiosResponse) => {
                if (resp.status === 200) {
                    setLogs(resp.data)
                } else {
                    setLogs({
                        data: [],
                        total: 0
                    })
                }
            })
            .catch(() => {
                toast({
                    title: 'Có lỗi xảy ra khi lấy log tin nhắn'
                })
            })
            .finally(() => setLoading(false))
    }, 400, {trailing: true})

    const fetchChartData = throttle(() => {
        if (loading) return;
        setLoading(true)
        LogRepository.statsByUser(params.id)
            .then((resp: AxiosResponse) => {
                if (resp.status === 200) {
                    setChartData(resp.data)
                } else {
                    setChartData([])
                }
            })
            .catch(() => {
                toast({
                    title: 'Có lỗi xảy ra khi lấy thông tin vẽ chart'
                })
            })
            .finally(() => setLoading(false))
    }, 400, {trailing: true})

    useEffect(() => {
        if (params.id) {
            fetchData()
            fetchChartData()
        }
    }, [params.id])

    if (!token) return null;

    return (
        <Layout>
            {/* ===== Top Heading ===== */}
            <Layout.Header sticky>
                {/* <Search/> */}
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch/>
                    <UserNav/>
                </div>
            </Layout.Header>

            <Layout.Body>
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>Xem log gửi tin nhắn của hệ thống! </h2>
                        {/* <p className='text-muted-foreground'> */}
                            {/* Here&apos;s a list of user activity for this month! */}
                        {/* </p> */}
                    </div>
                </div>
                <div className={'flex flex-col my-2'}>
                    <div><span>Người dùng: </span> <span className={'text-primary'}>{params?.id}</span></div>
                </div>
                <LogStatsChart chartData={chartData} />
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    <DataTable
                        data={logs.data}
                        columns={columns}
                        totalCount={logs?.total ?? 0}
                        page={page.current}
                        onFilter={(filter: any) => {
                            fetchData(filter)
                        }}
                        onPageChange={throttle((p: PaginationState) => {
                            page.current = {
                                pageSize: p.pageSize,
                                pageIndex: p.pageIndex,
                            }
                            fetchData()
                        }, 300)}
                    />
                </div>
            </Layout.Body>
        </Layout>
    )
}
