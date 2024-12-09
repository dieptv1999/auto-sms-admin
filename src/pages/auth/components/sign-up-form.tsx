import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { useToast } from '@/components/ui/use-toast.ts'
import { AxiosResponse, HttpStatusCode } from 'axios'
import { AnimatePresence } from "framer-motion";
import { DateTimePicker24h } from '@/components/custom/date-time-picker-24h'

const AuthRepository = RepositoryFactory.get('auth')

type SignUpFormProps = HTMLAttributes<HTMLDivElement> & {
    onClose?: () => void
}

const formSchema = z
    .object({
        email: z
            .string()
            .email({ message: 'Địa chỉ email sai định dạng' })
            .optional(),
        firstName: z.string().min(1, { message: 'Bạn chưa nhập họ và tên' }),
        username: z.string().min(10, { message: 'Số điện thoại sai định dạng' })
            .max(11, { message: 'Số điện thoại sai định dạng' })
            .regex(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại sai định dạng'),
        expireLicense: z.date().optional(),
    })

export function SignUpForm({
    className, onClose = () => {
    }, ...props
}: SignUpFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: undefined,
            username: undefined,
            firstName: '',
            expireLicense: undefined,
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

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <AnimatePresence initial={false}>
                        <div className={'grid gap-2'}>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Số điện thoại <span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="0339210xxx" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Địa chỉ email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="dpm@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Họ và tên</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nguyen Van A" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="expireLicense"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Ngày hết hạn license (license key sẽ tự sinh)</FormLabel>
                                            <FormControl>
                                                <DateTimePicker24h {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type={'submit'} className="mt-2" disabled={isLoading}>
                                Tạo tài khoản
                            </Button>
                        </div>
                    </AnimatePresence>
                </form>
            </Form>
        </div>
    )
}
