import BaseRepository from '@/api/base-repository.ts'
import { UserInterface } from "@/types/user.interface.ts";

const resource = '/user'

export default {

    getInfoMe() {
        return BaseRepository.get(`${resource}/me`)
    },
    update(payload: UserInterface) {
        return BaseRepository.put(`${resource}/profile`, payload)
    },
    search(params: any) {
        return BaseRepository.get(`${resource}/search`, { params })
    },
    statisticByDay(period: string) {
        return BaseRepository.get(`${resource}/statistic?period=${period}`)
    },
    activity(params: any) {
        return BaseRepository.get(`${resource}/activity`, { params })
    },
    top5() {
        return BaseRepository.get(`${resource}/top`)
    },
    updateNumDayDeleteVideo(userId: string, payload: any) {
        return BaseRepository.patch(`${resource}/${userId}/update-num-day-del-video`, payload)
    },
    upgradePlan(payload: any) {
        return BaseRepository.put(`${resource}/upgrade-plan`, payload)
    }
}