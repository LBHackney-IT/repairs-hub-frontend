import { useState } from 'react'

export const useIsOverSpendLimit = (raiseLimit: string) => {
  const [totalCost, setTotalCost] = useState<number>()

  const overSpendLimit = totalCost > parseInt(raiseLimit)

  return [
    overSpendLimit,
    (cost: number) => {
      setTotalCost(cost)
    },
  ]
}
