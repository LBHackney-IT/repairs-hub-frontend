import { ChangeEvent, useState } from 'react'
import { Trade } from '@/models/trade'

const useSelectTrade = (trades: Trade[] | null) => {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)

  const handleSelectTrade = (e: ChangeEvent<HTMLInputElement> | null) => {
    if (e === null) {
      setSelectedTrade(null)
      return
    }

    const selectedTrade = trades.filter((x) => x.name === e.target.value)

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
