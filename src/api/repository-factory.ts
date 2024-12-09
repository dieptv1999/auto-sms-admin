import AuthRepository from '@/api/auth-repository.ts'
import { get } from 'lodash'
import UserRepository from '@/api/user-repository.ts'
import FileRepository from '@/api/file-repository.ts'
import LogRepository from '@/api/log-repository.ts'

const repositories = {
  auth: AuthRepository,
  user: UserRepository,
  file: FileRepository,
  log: LogRepository,
}

export const RepositoryFactory: {
  get: (name: 'auth' | 'user' | 'file' | 'log') => any
} = {
  get: (name: 'auth' | 'user' | 'file' | 'log') => get(repositories, name)
}