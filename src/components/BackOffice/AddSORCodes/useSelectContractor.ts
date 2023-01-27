import { useState } from 'react'
import { Contractor } from './types'

const useSelectContractor = (contractors: Array<Contractor>) => {
  const [selectedContractor, setSelectedContractor] = useState<Contractor>(null)

  const handleSelectContractor = (e: InputEvent): void => {
    if (e === null) {
      setSelectedContractor(null)
      return
    }

    const input = e.target as HTMLInputElement

    const selectedContractor = contractors.filter(
      (x) => x.contractorName === input.value
    )

    if (selectedContractor.length === 0) {
      setSelectedContractor(null)
    } else {
      setSelectedContractor(selectedContractor[0])
    }
  }

  return {
    selectedContractor,
    handleSelectContractor,
  }
}

export default useSelectContractor
