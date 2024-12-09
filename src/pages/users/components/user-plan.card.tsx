import {Badge} from "@/components/ui/badge.tsx";

export default function UserPlanCard({plan}: {plan: number}) {

    const getLabel = () => {
        switch (plan) {
            case 0:
                return 'Gói miễn phí'
            case 1:
                return 'Gói cơ bản'
            case 2:
                return 'Gói tiết kiệm'
            case 3:
                return 'Gói cao cấp'
        }
    }

    return (
        <Badge className={'whitespace-nowrap'}>{getLabel()}</Badge>
    )
}