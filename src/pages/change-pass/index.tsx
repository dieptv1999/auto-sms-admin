import { Layout } from '@/components/custom/layout.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { Input } from '@/components/ui/input.tsx'
import { useState } from 'react'
import { AxiosResponse, HttpStatusCode } from 'axios'
import { toast } from '@/components/ui/use-toast.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { useMe } from '@/lib/store/meStore.ts'
import { Button } from '@/components/ui/button.tsx'

const UserRepository = RepositoryFactory.get('auth')

export default function ChangePass() {
  const me = useMe()
  const [loading, setLoading] = useState(false)
  const [p, setP] = useState('')

  const updatePass = () => {
    if (p?.trim().length <= 0) {
      toast({
        title: 'Mật khẩu không được để trống',
        variant: 'destructive'
      })
      return;
    }
    if (loading) return;
    setLoading(true)
    UserRepository.changePassAdmin({
      username: me.user?.username,
      password: p
    })
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Created) {
          toast({
            title: 'Cập nhật mật khẩu người dùng thành công'
          })
          setP('')
          localStorage.clear()
          window.location.href='/'
        } else {
          toast({
            title: 'Cập nhật mật khẩu người dùng thất bại. Vui lòng thử lại',
            variant: 'destructive'
          })
        }
      }).catch(() => {
      toast({
        title: 'Cập nhật mã người dùng thất bại. Vui lòng thử lại',
        variant: 'destructive'
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updatePass()
    }
  }

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
        <div className={'flex flex-col gap-2'}>
          <Input type={'password'} onKeyDown={handleKeyDown} value={p} onChange={(e) => setP(e.target.value)} disabled={loading} className={'w-96'} placeholder={'Điền mật khẩu mới (nhấn enter để đổi)'}/>
          <Button onClick={updatePass}>Đổi mật khẩu</Button>
        </div>
      </Layout.Body>
    </Layout>
  )
}