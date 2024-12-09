import BaseRepository from '@/api/base-repository.ts'

const resource = '/send-message-log'

export default {
    search(params: any) {
        return BaseRepository.get(`${resource}/search`, { params })
    },
    statsByUser(id: string) {
        return BaseRepository.get(`${resource}/stats/${id}`)
    },
    stats() {
        return BaseRepository.get(`${resource}/stats`)
    },
}