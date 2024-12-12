import {Layout} from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import {UserNav} from '@/components/user-nav'
import {DataTable} from './components/data-table'
import {columns} from './components/columns'
import {Button} from '@/components/custom/button'
import {useUser} from "@/lib/store/userStore.ts";
import {useEffect, useRef, useState} from "react";
import {PaginationState} from "@tanstack/react-table";
import {useAuth} from "@/context/auth.tsx";
import {throttle} from 'lodash'
import DialogCustomerSignUp from "@/pages/auth/dialog-customer-sign-up.tsx";
import {NumberParam, useQueryParam} from "use-query-params";
import UpgradeLicenseDialog from './components/upgrade-license.dialog.tsx'

export default function UsersPage() {
    const [v] = useQueryParam('v', NumberParam);
    const {users, totalUser, fetchUsers} = useUser()
    const [registing, setRegisting] = useState(false)
    const page = useRef<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const {token} = useAuth()
    const [loading, setLoading] = useState(false)

    const fetchData = throttle((payload?: any) => {
        if (loading) return;
        setLoading(true)
        fetchUsers({
            page: page.current.pageIndex,
            limit: page.current.pageSize,
            ...(payload ?? {}),
        })
        setLoading(false)
    }, 500, {trailing: true})

    useEffect(() => {
        fetchData()
    }, [token, v]);

    if (!token) return null;

    return (
        <Layout>
            {/* ===== Top Heading ===== */}
            <Layout.Header sticky>
                {/* <Search /> */}
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch/>
                    <UserNav/>
                </div>
            </Layout.Header>

            <Layout.Body className={'flex justify-center w-full'}>
                <div className={'max-w-screen-xl w-full'}>
                    <div className='mb-2 flex items-center justify-between space-y-2'>
                        <div>
                            <h2 className='text-2xl font-bold tracking-tight'>Danh sách người dùng!</h2>
                        </div>
                        <div>
                            <Button onClick={() => setRegisting(true)}>
                                Create User
                            </Button>
                        </div>
                    </div>
                    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                        <DataTable
                            data={users}
                            columns={columns}
                            totalCount={totalUser ?? 0}
                            page={page.current}
                            onFilter={(filter: any) => {
                                fetchData(filter)
                            }}
                            onPageChange={(p: PaginationState) => {
                                page.current = {
                                    pageSize: p.pageSize,
                                    pageIndex: p.pageIndex,
                                }
                                fetchData()
                            }}
                        />
                    </div>
                    <DialogCustomerSignUp
                        open={registing}
                        setOpen={setRegisting}
                    />
                    <UpgradeLicenseDialog/>
                </div>
            </Layout.Body>
        </Layout>
    )
}
