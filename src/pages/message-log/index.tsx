import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { useEffect, useRef, useState } from 'react'
import { RepositoryFactory } from '@/api/repository-factory'
import { AxiosResponse } from 'axios'
import { toast } from '@/components/ui/use-toast'
import { PaginationState } from '@tanstack/react-table'
import { throttle } from 'lodash'
import { LogStatsChart } from './components/log-stats-chart'

const LogRepository = RepositoryFactory.get('log')

export default function MessageLogPage() {
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


  const fetchData = (payload?: any) => {
    if (loading) return;
    setLoading(true)
    LogRepository.search({
      page: page.current.pageIndex,
      limit: page.current.pageSize,
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
  }

  const fetchChartData = () => {
    if (loading) return;
    setLoading(true)
    LogRepository.stats()
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
  }

  useEffect(() => {
      fetchData()
      fetchChartData()
  }, [])

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        {/* <Search /> */}
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Xem log gửi tin nhắn của hệ thống!</h2>
          </div>
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
