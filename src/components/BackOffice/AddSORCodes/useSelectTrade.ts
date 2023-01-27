import { useState } from 'react'

import { Trade } from './types'

const useSelectTrade = (trades: Array<Trade>) => {
  const [selectedTrade, setSelectedTrade] = useState<Trade>(null)

  const handleSelectTrade = (e: Event) => {
    if (e === null) {
      setSelectedTrade(null)
      return
    }

    const input = e.target as HTMLInputElement;

    const selectedTrade = trades.filter((x) => x.name === input.value)

    if (selectedTrade.length === 0) {
      setSelectedTrade(null)
    } else {
      setSelectedTrade(selectedTrade[0])
    }
  }

  return {
    selectedTrade,
    handleSelectTrade,
  }
}

export default useSelectTrade
