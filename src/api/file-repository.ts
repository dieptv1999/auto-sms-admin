import BaseRepository from '@/api/base-repository.ts'

const resource = '/file'

export default {
  uploadFile(formData: FormData) {
    return BaseRepository.post(`${resource}/upload`, formData)
  },
  getLinkObject(filename: string) {
    return BaseRepository.get(`${resource}/${filename}`)
  },
  getStorage() {
    return BaseRepository.get(`/admin${resource}/storage`)
  },
  localUpload(payload: FormData) {
    return BaseRepository.post(`${resource}/local/upload`, payload)
  },
}