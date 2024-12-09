import {Layout} from '@/components/custom/layout'
import {Card, CardContent, CardHeader, CardTitle,} from '@/components/ui/card'
import {Search} from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import {TopNav} from '@/components/top-nav'
import {UserNav} from '@/components/user-nav'
import {useTranslations} from 'use-intl'
import {IconPlayerPlay, IconUsers} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useAuth} from "@/context/auth.tsx";

export default function Dashboard() {
    const [data, setData] = useState<any>({});
    const {token} = useAuth()
    const t = useTranslations('dashboard')

    const fetchData = () => {
    }

    useEffect(() => {
        fetchData()
    }, [token]);
    return (
        <Layout>
            {/* ===== Top Heading ===== */}
            <Layout.Header>
                {/* <TopNav links={topNav}/> */}
                <div className='ml-auto flex items-center space-x-4'>
                    {/* <Search/> */}
                    <ThemeSwitch/>
                    {/*<LanguageSwitch />*/}
                    <UserNav/>
                </div>
            </Layout.Header>

            {/* ===== Main ===== */}
            <Layout.Body>
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <h1 className='text-2xl font-bold tracking-tight'>
                        {t('dashboard')}
                    </h1>
                </div>
                <div className='space-y-4'>
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total users
                                </CardTitle>
                                <IconUsers/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.totalUser}</div>
                                <p className="text-xs text-muted-foreground">
                                    all time
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total users in day
                                </CardTitle>
                                <IconUsers/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.totalUserInDay}</div>
                                {/*<p className="text-xs text-muted-foreground">*/}
                                {/*  +180.1% from last month*/}
                                {/*</p>*/}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total videos</CardTitle>
                                <IconPlayerPlay/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.totalVideo}</div>
                                {/*<p className="text-xs text-muted-foreground">*/}
                                {/*  +19% from last month*/}
                                {/*</p>*/}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total videos in day</CardTitle>
                                <IconPlayerPlay/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.totalInDay}</div>
                                {/*<p className="text-xs text-muted-foreground">*/}
                                {/*  +19% from last month*/}
                                {/*</p>*/}
                            </CardContent>
                        </Card>
                    </div>
                    {/*<OrderPerDayOverview/>*/}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {/*<UserPerDayOverview/>*/}
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}

const topNav = [
    {
        title: 'dashboard.overview',
        href: 'dashboard/overview',
        isActive: true,
    },
    {
        title: 'dashboard.customers',
        href: 'dashboard/customers',
        isActive: false,
    },
    {
        title: 'dashboard.products',
        href: 'dashboard/products',
        isActive: false,
    },
    {
        title: 'dashboard.settings',
        href: 'dashboard/settings',
        isActive: false,
    },
]
