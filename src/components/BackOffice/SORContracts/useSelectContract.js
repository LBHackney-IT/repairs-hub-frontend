import { useState, useEffect } from 'react'

import { fetchContractors, fetchContracts } from '../requests'

import useSelectContractor from '../AddSORCodes/useSelectContractor'

const useSelectContract = () => {
  const [contractors, setContractors] = useState(null)
  const { selectedContractor, handleSelectContractor } = useSelectContractor(
    contractors
  )

  const [loadingContracts, setLoadingContracts] = useState(false)
  const [contracts, setContracts] = useState(null)
  const [selectedContract, setSelectedContract] = useState(null)

  const [loadingContractors, setLoadingContractors] = useState(false)

  useEffect(() => {
    // load contracts

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
    setSelectedContract,
    loadingContracts,
    loadingContractors
  }
}

export default useSelectContract
