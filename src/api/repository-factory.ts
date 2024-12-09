import AuthRepository from '@/api/auth-repository.ts'
import {get} from 'lodash'
import UserRepository from '@/api/user-repository.ts'
import FileRepository from '@/api/file-repository.ts'

const repositories = {
  auth: AuthRepository,
  user: UserRepository,
  file: FileRepository,
}

export const RepositoryFactory: {
  get: (name: 'auth' | 'user' | 'file') => any
} = {
  get: (name: 'auth' | 'user' | 'file') => get(repositories, name)
}