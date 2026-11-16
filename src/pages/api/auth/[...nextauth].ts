import NextAuth from 'next-auth'
import { authOptions } from '@/utils/auth/authOptions'

export default NextAuth(authOptions)
