import {HTMLAttributes, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useSearchParams} from 'react-router-dom'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/custom/button'
import {PasswordInput} from '@/components/custom/password-input'
import {cn} from '@/lib/utils'
import {IUserStore, useMe} from "@/lib/store/meStore.ts";
import {useAuth} from "@/context/auth.tsx";
import {debounce} from "lodash";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {
}

const formSchema = z.object({
    username: z
        .string()
        .min(9, {message: 'Please enter your username'}),
    password: z
        .string()
        .min(1, {
            message: 'Please enter your password',
        })
        .min(7, {
            message: 'Password must be at least 7 characters long',
        }),
})

export function UserAuthForm({className, ...props}: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const {signIn} = useMe((state: IUserStore) => state)
    const [searchParams] = useSearchParams()
    const redirectUrl = searchParams.get('q') ?? '/'
    const token = searchParams.get('token')
    const newUser = searchParams.get('newUser')
    const {setToken} = useAuth()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const rlt = await signIn({
                ...data
            })
            if (rlt) {
                // * check inviteToken for invite to organization
                window.location.href = redirectUrl
            }
        } finally {
            setIsLoading(false)
        }
    }

    const checkToken = debounce(() => {
        if (token && token.length > 0) {
            setToken(token)

            // * check inviteToken for invite to organization
            window.location.href = redirectUrl
        }
    }, 150)

    useEffect(() => {
        checkToken()
    }, [token, newUser])

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='grid gap-2'>
                        <FormField
                            control={form.control}
                            name='username'
                            render={({field}) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder='0339210xxx' {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({field}) => (
                                <FormItem className='space-y-1'>
                                    <div className='flex items-center justify-between'>
                                        <FormLabel>Mật khẩu</FormLabel>
                                    </div>
                                    <FormControl>
                                        <PasswordInput placeholder='********' {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button className='mt-2' disabled={isLoading}>
                            Đăng nhập
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
