import { toast } from '@/components/ui/use-toast'
import axios, { AxiosResponse, HttpStatusCode } from 'axios'
import axiosRetry from 'axios-retry'

console.log(import.meta.env.VITE_BASE_DOMAIN)
export const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN
export const BASE_URL = `${BASE_DOMAIN}/auto-sms/v1`

const instance = axios.create({
  baseURL: BASE_URL,
})

export default instance

const errorHandler = (error: any) => {
  toast({
    title: `${error.response.data.message}`,
    draggable: true,
    variant: 'destructive',
  })

  return Promise.reject({ ...error })
}

instance.interceptors.request.use((config) => {
  if (localStorage.getItem('token'))
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`

  return config
})

instance.interceptors.response.use(
  async (response) => {
    const originalRequest = response.config
    const serverCallUrl = originalRequest.url
    const status = response?.data?.status

    if (
      status == 401 &&
      !window.location.href?.includes('/sign-in') &&
      !serverCallUrl?.includes('/refresh')
    ) {
      const refresh_token = localStorage.getItem('refresh_token')

      if (refresh_token) {
        // * refresh token
        await refreshToken(response, () => {
          toast({
            title: response?.data
              ? `${response?.data?.message}`
              : 'Có lỗi xảy ra, vui lòng đăng nhập lại',
            draggable: true,
            variant: 'destructive',
          })

          localStorage.removeItem('token')
          window.location.href = '/sign-in'
        })
      } else {
        if (status >= 300 && status < 500) {
          toast({
            title: response?.data
              ? `${response?.data?.message}`
              : 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
            draggable: true,
            variant: 'destructive',
          })
        }
        localStorage.removeItem('token')
        window.location.href = '/sign-in'
      }
    }
    return response.data
  },
  async (error) => {
    const originalRequest = error.config
    const serverCallUrl = originalRequest.url
    const status = error.response?.data?.status
    console.debug(error.response?.data, serverCallUrl)

    if (
      status === 401 &&
      !window.location.href?.includes('/sign-in') &&
      !serverCallUrl?.includes('/refresh')
    ) {
      const refresh_token = localStorage.getItem('refresh_token')

      if (refresh_token) {
        // * refresh token
        await refreshToken(error, () => {
          localStorage.removeItem('token')
          window.location.href = '/sign-in'
        })
      } else {
        localStorage.removeItem('token')
        window.location.href = '/sign-in'
      }
    } else return errorHandler(error)
  }
)

axiosRetry(instance, { retries: 2 })

const refreshToken = async (_error: AxiosResponse, logout: any) => {
  try {
    const refresh_token = localStorage.getItem('refresh_token')
    const resp = await axios.get(`${BASE_URL}/auth/refresh`, {
      headers: {
        ...instance.defaults.headers.common,
        Authorization: `Bearer ${refresh_token}`,
      },
    })
    if (resp?.status === HttpStatusCode.Ok) {
      localStorage.setItem('token', resp.data?.token)
      window.dispatchEvent(new Event('storage'))

      instance.defaults.headers.common['Authorization'] = resp.data
    } else {
      localStorage.removeItem('refresh_token')
      logout()
    }
  } catch (error) {
    localStorage.removeItem('refresh_token')
    logout()
    return
  }
}
