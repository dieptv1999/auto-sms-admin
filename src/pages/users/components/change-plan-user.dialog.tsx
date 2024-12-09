import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {useUser} from "@/lib/store/userStore";
import UserPlanCard from "./user-plan.card";
import {useCallback, useEffect} from "react";
import {RepositoryFactory} from "@/api/repository-factory";
import {AxiosResponse, HttpStatusCode} from "axios";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MONEY_PER_GB, MoneyPerUserPlan, NamedUserPlan, StoragePerUser} from "@/lib/constants";
import {UserPlan} from "@/lib/enum/user.plan";
import {Button} from "@/components/custom/button";
import {toast} from "@/components/ui/use-toast";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField,} from '@/components/ui/form'
import {numberWithCommas, ONE_MB_PER_GB} from "@/lib/utils";
import {get} from "lodash";
import {Controller, useFieldArray, useForm} from "react-hook-form";

const UserRepository = RepositoryFactory.get('user')

const upgradePlanFormSchema = z.object({
    plan: z.coerce.number(),
    stores: z.array(z.object({
        storeId: z.string(),
        storeName: z.string().optional(),
        plan: z.coerce.number(),
        storage: z.coerce.number(),
    }))
})

type UpgradePlanFormValues = z.infer<typeof upgradePlanFormSchema>

export default function ChangePlanUserDialog() {
    const { changePlanData, setChangePlanData } = useUser();

    const form = useForm<UpgradePlanFormValues>({
        resolver: zodResolver(upgradePlanFormSchema),
        defaultValues: {
            plan: UserPlan.free,
            stores: []
        },
        mode: 'onChange',
    })

    const { fields, append, update } = useFieldArray({
        control: form.control,
        name: "stores",
    });

    function onSubmit(data: UpgradePlanFormValues) {
        UserRepository.upgradePlan({
            userId: changePlanData.id,
            plan: data.plan,
            stores: data.stores.map(e => ({
                ...e,
                storage: e.storage * ONE_MB_PER_GB,
            }))
        }).then((resp: AxiosResponse) => {
            if (resp.status === HttpStatusCode.Ok || resp.status === HttpStatusCode.Created) {
                toast({
                    title: 'Upgrade user plan successful'
                })
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Upgrade user plan failed'
                })
            }
        })

        return false;
    }

    const calculateMoney = () => {
        let totalMoney = 0;
        const items = form.watch('stores')
        items.every(e => {
            const plan = e.plan
            const storage = e.storage ?? 0 // GB
            const defaultLimit = get<number>(StoragePerUser, plan) ?? 0
            let money = get<number>(MoneyPerUserPlan, plan)
            if (storage * ONE_MB_PER_GB > defaultLimit) {
                const moreStore = Math.ceil(storage * ONE_MB_PER_GB - defaultLimit) / ONE_MB_PER_GB

                money += moreStore * MONEY_PER_GB
            }

            totalMoney += money
        })

        return totalMoney;
    }

    const fetchData = useCallback(() => {
        if (changePlanData) {
            form.setValue('plan', changePlanData.plan)
        }
    }, [changePlanData])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <Dialog open={!!changePlanData} onOpenChange={() => setChangePlanData(null)}>
            <DialogContent className="max-w-screen-md">
                <DialogTitle>Change user plan</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        {changePlanData && <div>
                            <div className="flex justify-between">
                                <div>Current plan: <UserPlanCard plan={changePlanData.plan} /></div>
                                <div className="flex gap-2 items-center">
                                    <span>New plan: </span>
                                    <FormField
                                        control={form.control}
                                        name='plan'
                                        render={({ field }) => (
                                            <Select value={field.value?.toString()} onValueChange={(v) => {
                                                // * change user plan of every store
                                                fields.every((e, index) => {
                                                    update(index, {
                                                        ...e,
                                                        plan: parseInt(v),
                                                        storage: get(StoragePerUser, v) / ONE_MB_PER_GB,
                                                    })
                                                })
                                                field.onChange(v)
                                            }} defaultValue={UserPlan.free.toString()}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Gói người dùng" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {Object.entries(NamedUserPlan).map(([key, value]) => (
                                                            <SelectItem value={key} key={key + 'user'}>{value}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 my-4">
                                {fields?.map((field, index) => (
                                    <div key={field.id} className="py-2 px-4 border rounded flex gap-3 items-center">
                                        <Controller
                                            control={form.control}
                                            name={`stores.${index}.storeName`}
                                            render={({ field }) => (
                                                <div className="flex-1">{field.value}</div>
                                            )}
                                        />
                                        <Controller
                                            control={form.control}
                                            name={`stores.${index}.plan`}
                                            render={({ field }) => (
                                                <Select value={field.value?.toString()} onValueChange={(v) => {
                                                    field.onChange(v)
                                                    form.setValue(`stores.${index}.storage`, get(StoragePerUser, v) / ONE_MB_PER_GB)
                                                }} defaultValue={UserPlan.free.toString()}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Gói người dùng" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {Object.entries(NamedUserPlan).map(([key, value]) => (
                                                                <SelectItem value={key} key={key}>{value}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <Controller
                                            control={form.control}
                                            name={`stores.${index}.storage`}
                                            render={({ field }) => (
                                                <Input type="number" placeholder="60" max={400} className="w-24" value={field.value} onChange={(e) => {
                                                    field.onChange(e)
                                                }} />
                                            )}
                                        />
                                    </div>
                                ))}

                                <div className="py-2 px-4 border rounded flex gap-3 items-center">
                                    <div className="flex-1">Tổng giá tiền</div>
                                    <div className="font-semibold text-primary">{numberWithCommas(calculateMoney())} VND</div>
                                </div>
                            </div>
                        </div>}
                        <Button className="w-full" type="submit">Upgrade</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}