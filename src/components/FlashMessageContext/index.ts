import { createContext } from 'react'

interface FlashMessageContextValue {
  setModalFlashMessage: (message: string) => void
}

const FlashMessageContext = createContext<FlashMessageContextValue>({
  setModalFlashMessage: () => {},
})

export default FlashMessageContext
