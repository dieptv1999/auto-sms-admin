import {RepositoryFactory} from "@/api/repository-factory";
import {Button} from "@/components/custom/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/use-toast";
import {useUser} from "@/lib/store/userStore";
import {zodResolver} from "@hookform/resolvers/zod";
import {AxiosResponse, HttpStatusCode} from "axios";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

const UserRepository = RepositoryFactory.get('user')

const formSchema = z.object({
    numDayDeleteVideo: z.coerce
        .number()
        .min(10, { message: 'Please enter your num day delete video (min 10 days)' }),
})

export default function ChangeVideoDeleteTimeDialog({ onReload }: { onReload: () => void }) {
    const { updateDeleteTimeData, setUpdateDeleteTimeData } = useUser()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            numDayDeleteVideo: 25,
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        UserRepository.updateNumDayDeleteVideo(updateDeleteTimeData.id, data)
            .then((resp: AxiosResponse) => {
                if (resp.status === HttpStatusCode.Ok) {
                    toast({
                        title: 'Update store name successful'
                    })
                    setUpdateDeleteTimeData(undefined)
                    onReload()
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Update store name failed'
                    })
                }
            })
            .catch(() => {
                toast({
                    variant: 'destructive',
                    title: 'Update store name failed'
                })
            })
    }

    useEffect(() => {
        if (updateDeleteTimeData) {
            form.reset({
                numDayDeleteVideo: updateDeleteTimeData.numDayDeleteVideo
            })
        }
    }, [updateDeleteTimeData])

    return (
        <Dialog open={!!updateDeleteTimeData} onOpenChange={() => setUpdateDeleteTimeData(undefined)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Number Days Delete Video</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                        <FormField
                            control={form.control}
                            name='numDayDeleteVideo'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormControl>
                                        <Input placeholder='DHN' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button>Cập nhật</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}