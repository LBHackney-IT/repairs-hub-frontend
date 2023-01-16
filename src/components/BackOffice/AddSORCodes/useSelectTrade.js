import { useState } from 'react'

const useSelectTrade = (trades) => {
  const [selectedTrade, setSelectedTrade] = useState(null)
  const handleSelectTrade = (e) => {
    const selectedTrade = trades.filter((x) => x.name === e.target.value)

    setSelectedTrade(selectedTrade.length === 0 ? null : selectedTrade[0])
  }

  return {
    selectedTrade,
    handleSelectTrade,
  }
}

export default useSelectTrade
