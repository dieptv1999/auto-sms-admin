import {Badge} from "@/components/ui/badge.tsx";
import { NamedUserPlan } from "@/lib/constants";
import { UserPlan } from "@/lib/enum/user.plan";

export default function UserPlanCard({plan}: {plan: number}) {

    const getLabel = () => {
        switch (plan) {
            case UserPlan.free:
                return NamedUserPlan[UserPlan.free]
            case UserPlan.silver:
                return NamedUserPlan[UserPlan.silver]
            case UserPlan.gold:
                return NamedUserPlan[UserPlan.gold]
            case UserPlan.diamond:
                return NamedUserPlan[UserPlan.diamond]
        }
    }

    return (
        <Badge>{getLabel()}</Badge>
    )
}