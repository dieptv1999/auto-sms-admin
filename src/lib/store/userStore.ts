import { create } from 'zustand'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { AxiosResponse, HttpStatusCode } from "axios";

const UserRepository = RepositoryFactory.get('user')

export interface IUserStore {
  users: any[];
  activities: any[];
  userActivityPage: any;
  totalUser: number;
  totalActivity: number;
  fetchUsers: (prop: any) => void;
  fetchActivities: (prop: any) => void;
  top5: any[];
  fetchTop5: () => void;
  changePlanData: any;
  setChangePlanData: (v: any) => void;
  updateDeleteTimeData: any;
  setUpdateDeleteTimeData: (v: any) => void;
}

const initState = {
  users: [],
  activities: [],
  totalUser: 0,
  totalActivity: 0,
  userActivityPage: undefined,
  top5: [],
  changePlanData: null,
  updateDeleteTimeData: null,
}

export const useUser = create<IUserStore>(
  (set) => ({
    ...initState,
    fetchUsers: (prop: any) => {
      UserRepository.search({
        ...(prop ?? {})
      }).then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          set({
            users: resp.data?.data,
            totalUser: resp.data?.total
          })
        } else {
          set({
            users: [],
            totalUser: 0,
          })
        }
      })
    },
    fetchActivities: (prop: any) => {
      UserRepository.activity({
        ...(prop ?? {})
      }).then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          set({
            userActivityPage: resp.data?.user,
            activities: resp.data?.data,
            totalActivity: resp.data?.total
          })
        } else {
          set({
            activities: [],
            totalActivity: 0,
          })
        }
      })
    },
    fetchTop5: () => {
      UserRepository.top5().then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          set({
            top5: resp.data,
          })
        } else {
          set({
            top5: [],
          })
        }
      })
    },
    setChangePlanData: (v: any) => set({ changePlanData: v }),
    setUpdateDeleteTimeData: (v: any) => set({ updateDeleteTimeData: v }),
  })
)