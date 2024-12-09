import {Card} from '@/components/ui/card'
import {SignUpForm} from './components/sign-up-form'
import {Dialog, DialogContent} from "@/components/ui/dialog.tsx";
import logo from '@/assets/logo_1.png'
import {NumberParam, useQueryParam} from "use-query-params";

export default function DialogCustomerSignUp({open, setOpen}: { open: boolean, setOpen: (open: boolean) => void }) {
    const [v, setV] = useQueryParam('v', NumberParam);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={'p-6'}>
                <div className='flex w-full flex-col justify-center space-y-2'>
                    <div className='mb-4 flex items-center justify-center gap-2'>
                        <img
                            src={logo}
                            className=""
                            width={28}
                            height={28}
                            alt="Logo"
                        />
                        <h1 className='text-xl font-medium'>DHN Admin</h1>
                    </div>
                    <Card className='p-6'>
                        <div className='mb-2 flex flex-col space-y-2 text-left'>
                            <h1 className='text-lg font-semibold tracking-tight'>
                                Tạo tài khoản
                            </h1>
                            <p className='text-sm text-muted-foreground'>
                                Nhập địa chỉ email và mật khẩu để tiếp tục. <br/>
                            </p>
                        </div>
                        <SignUpForm onClose={() => {
                            setOpen(false)
                            setV((v ?? 1) + 1)
                        }}/>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}
