import { useState, useEffect } from 'react'

import { fetchContractors, fetchContracts } from '../requests'

const useSelectContract = () => {
  const [contractors, setContractors] = useState(null)
  const [selectedContractor, setSelectedContractor] = useState(null)

  const [loadingContracts, setLoadingContracts] = useState(false)
  const [contracts, setContracts] = useState(null)
  const [selectedContract, setSelectedContract] = useState(null)

  const [loadingContractors, setLoadingContractors] = useState(false)

  useEffect(() => {
    setLoadingContractors(true)

    fetchContractors()
      .then((res) => {
        console.log({ res })
        setContractors(res)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoadingContractors(false)
      })
  }, [])

  useEffect(() => {
    handleContractorChange()
  }, [selectedContractor])

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

  const handleSelectContract = (e) => {
    setSelectedContract(e.target.value)
  }

  const handleContractorChange = () => {
    if (selectedContractor === null) {
      setContracts(null)
      setSelectedContract(null)
      return
    }

    setLoadingContracts(true)

    fetchContracts(selectedContractor.contractorReference)
      .then((res) => {
        setContracts(res)
      })
      .finally(() => {
        setLoadingContracts(false)
      })
  }

  return {
    contractors,
    handleSelectContractor,
    selectedContractor,
    contracts,
    selectedContract,
    loadingContracts,
    loadingContractors,
    handleSelectContract,
  }
}

export default useSelectContract
