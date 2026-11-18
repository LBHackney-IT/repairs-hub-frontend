import { createContext } from 'react'
import { buildUser } from '@/utils/user'

export type User = ReturnType<typeof buildUser>

interface UserContextValue {
  user: User | null | undefined
}

const UserContext = createContext<UserContextValue>({
  user: null,
})

export default UserContext
