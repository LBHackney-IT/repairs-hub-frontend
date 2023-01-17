import { useState } from 'react'

const useSelectTrade = (trades) => {
  const [selectedTrade, setSelectedTrade] = useState(null)

  const handleSelectTrade = (e) => {
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
