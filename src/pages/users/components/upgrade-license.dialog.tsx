import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {useUser} from "@/lib/store/userStore";
import {RepositoryFactory} from "@/api/repository-factory";
import {AxiosResponse, HttpStatusCode} from "axios";
import {Button} from "@/components/custom/button";
import {toast} from "@/components/ui/use-toast";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {useForm} from "react-hook-form";
import {DateTimePicker24h} from "@/components/custom/date-time-picker-24h.tsx";
import {NumberParam, useQueryParam} from "use-query-params";
import {useEffect} from "react";

const UserRepository = RepositoryFactory.get('user')

const upgradePlanFormSchema = z.object({
    expireLicense: z.coerce.date(),
})

type UpgradePlanFormValues = z.infer<typeof upgradePlanFormSchema>

export default function UpgradeLicenseDialog() {
    const [v, setV] = useQueryParam('v', NumberParam);
    const { changePlanData, setChangePlanData } = useUser();

    const form = useForm<UpgradePlanFormValues>({
        resolver: zodResolver(upgradePlanFormSchema),
        defaultValues: {
            expireLicense: undefined,
        },
        mode: 'onChange',
    })

    function onSubmit(data: UpgradePlanFormValues) {
        UserRepository.updateLicense({
            userId: changePlanData.id,
            expireLicense: data.expireLicense,
        }).then((resp: AxiosResponse) => {
            if (resp.status === HttpStatusCode.Ok || resp.status === HttpStatusCode.Created) {
                toast({
                    title: 'Cập nhật license cho người dùng thành công'
                })
                setChangePlanData(undefined)
                setV((v ?? 0) + 1)
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Cập nhật license cho người dùng thất bại, vui lòng thử lại'
                })
            }
        })

        return false;
    }

    useEffect(() => {
        if (changePlanData) {
            console.log(changePlanData?.expireLicense)
            form.setValue('expireLicense', typeof changePlanData?.expireLicense === 'string' ? new Date(changePlanData.expireLicense) : changePlanData?.expireLicense)
        }
    }, [changePlanData]);

    return (
        <Dialog open={!!changePlanData} onOpenChange={() => setChangePlanData(null)}>
            <DialogContent className="">
                <DialogTitle>Cập nhật license người dùng</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                        <Button className="w-full" type="submit">Cập nhật</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}