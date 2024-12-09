import {HTMLAttributes, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/custom/button'
import {PasswordInput} from '@/components/custom/password-input'
import {cn} from '@/lib/utils'
import {RepositoryFactory} from '@/api/repository-factory.ts'
import {useToast} from '@/components/ui/use-toast.ts'
import {AxiosResponse, HttpStatusCode} from 'axios'
import {AnimatePresence} from "framer-motion";

const AuthRepository = RepositoryFactory.get('auth')

type SignUpFormProps = HTMLAttributes<HTMLDivElement> & {
    onClose?: () => void
}

const formSchema = z
    .object({
        email: z
            .string()
            .min(1, {message: 'Bạn chưa nhập email'})
            .email({message: 'Địa chỉ email sai định dạng'}),
        firstName: z.string().min(1, {message: 'Bạn chưa nhập họ và tên'}),
        // phoneNumber: z.string().min(10, {message: 'Số điện thoại sai định dạng'})
        //     .max(11, {message: 'Số điện thoại sai định dạng'})
        //     .regex(/^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9])(?=[^#?!@$%^&*\-()\n]*[#?!@$%^&*()-]).\S{8,64}$/, 'Số điện thoại sai định dạng'),
        password: z
            .string()
            .min(1, {
                message: 'Bạn chưa nhập mật khẩu',
            })
            .min(8, {
                message: 'Mật khẩu tối thiểu 8 ký tự',
            })
            .max(64, {
                message: 'Mật khẩu có tối đa 64 ký tự',
            }),
        confirmPassword: z.string(),
        storeName: z.string({message: 'Tên của hàng không được để trống'}).min(5, {message: 'Tên cửa hàng ít nhất 5 ký tự'}),
        field: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword,
        {
            message: 'Mật khẩu không khớp.',
            path: ['confirmPassword'],
        }
    )

export function SignUpForm({
                               className, onClose = () => {
    }, ...props
                           }: SignUpFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const {toast} = useToast()
    const [step, setStep] = useState(1)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            firstName: '',
            password: '',
            confirmPassword: '',
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const rsp: AxiosResponse = await AuthRepository.register(data)

            if (rsp.status === HttpStatusCode.Created) {
                toast({
                    title: 'Create user successful'
                })
                onClose()
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Register failed',
                })
            }
        } catch (e: any) {
            toast({
                variant: 'destructive',
                title: e.response?.data?.message,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleNext = async () => {
        let isValid = await form.trigger(['email', 'firstName', 'password', 'confirmPassword'])

        if (isValid) setStep(2)
    }

    const handlePrev = () => {
        setStep(1)
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <AnimatePresence initial={false}>
                        <div className={'grid gap-2'}>
                            {step === 1 && <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Địa chỉ email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="dpm@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({field}) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Họ và tên</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nguyen Van A" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Mật khẩu</FormLabel>
                                            <FormControl>
                                                <PasswordInput placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({field}) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Xác nhận mật khẩu</FormLabel>
                                            <FormControl>
                                                <PasswordInput placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>}
                            {step === 2 && <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="storeName"
                                    render={({field}) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Tên cửa hàng</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Điện máy DPM" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="field"
                                    render={({field}) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Lĩnh vực hoạt động</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Điện máy, đồ sơ sinh" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>}

                            {step === 1 && <Button type={'button'} onClick={handleNext} className="mt-2">
                                Tiếp tục
                            </Button>}
                            {step === 2 && <div className={'grid grid-cols-2 gap-2'}>
                                <Button type={'button'} variant={'outline'} onClick={handlePrev} className="mt-2">
                                    Trước
                                </Button>
                                <Button type={'submit'} className="mt-2" disabled={isLoading}>
                                    Tạo tài khoản
                                </Button>
                            </div>}
                        </div>
                    </AnimatePresence>
                </form>
            </Form>
        </div>
    )
}
