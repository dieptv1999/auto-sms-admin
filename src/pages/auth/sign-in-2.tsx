import { Card } from '@/components/ui/card'
import { UserAuthForm } from './components/user-auth-form'
import logo from '@/assets/logo_1.png'

export default function SignIn2() {
  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <div className='mb-4 flex items-center justify-center gap-2'>
            <img src={logo} width={36} height={36} alt={'logo'}/>
            <h1 className='text-xl font-medium'>DHN Admin</h1>
          </div>
          <Card className='p-6'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Đăng nhập</h1>
              <p className='text-sm text-muted-foreground'>
                Nhập email và mật khẩu bên dưới <br/>
                để đăng nhập vào tài khoản của bạn<br/>
              </p>
            </div>
            <UserAuthForm />
          </Card>
        </div>
      </div>
    </>
  )
}
