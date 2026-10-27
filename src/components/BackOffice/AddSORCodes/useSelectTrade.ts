import { ChangeEvent, useState } from 'react'

export interface Trade {
  code: string
  name: string
}

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
