import { QueryClient } from 'react-query'

export const ONE_MINUTE = 60 * 1000
export const FIVE_MINUTES = 5 * 60 * 1000
export const FOUR_HOURS = 4 * 60 * 60 * 1000

// Shared by QueryClientProvider (_app.tsx) and the request functions, so that
// requests made outside of a hook share the same cache as useQuery
export const queryClient = new QueryClient()
