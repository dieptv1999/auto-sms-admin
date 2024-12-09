import {Layout} from '@/components/custom/layout'
import {Search} from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import {UserNav} from '@/components/user-nav'
import {DataTable} from './components/data-table'
import {columns} from './components/columns'
import {useUser} from "@/lib/store/userStore.ts";
import {useEffect, useRef, useState} from "react";
import {PaginationState} from "@tanstack/react-table";
import {useAuth} from "@/context/auth.tsx";
import {throttle} from 'lodash'
import {useParams} from "react-router-dom";

export default function UserActivityPage() {
    const params = useParams()
    const {activities, totalActivity, userActivityPage, fetchActivities} = useUser()
    const page = useRef<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const {token} = useAuth()
    const [loading, setLoading] = useState(false)

    const fetchData = throttle((payload?: any) => {
        if (loading) return;
        setLoading(true)
        fetchActivities({
            page: page.current.pageIndex,
            limit: page.current.pageSize,
            userId: params.id,
            ...(payload ?? {}),
        })
        setLoading(false)
    }, 200, {leading: true})

    useEffect(() => {
        if (params.id)
            fetchData()
    }, [token, params.id]);

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
                        <h2 className='text-2xl font-bold tracking-tight'>Lịch sử hoạt động người dùng!</h2>
                        {/* <p className='text-muted-foreground'> */}
                            {/* Here&apos;s a list of user activity for this month! */}
                        {/* </p> */}
                    </div>
                </div>
                <div className={'flex flex-col my-2'}>
                    <div><span>Người dùng: </span> <span className={'text-primary'}>{userActivityPage?.username}</span></div>
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    <DataTable
                        data={activities}
                        columns={columns}
                        totalCount={totalActivity ?? 0}
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
