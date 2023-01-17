import { useState } from 'react'

const useSelectContractor = (contractors) => {
  const [selectedContractor, setSelectedContractor] = useState(null)

  const handleSelectContractor = (e) => {
    if (e === null) {
      setSelectedContractor(null)
      return
    }

    const selectedContractor = contractors.filter(
      (x) => x.contractorName === e.target.value
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
