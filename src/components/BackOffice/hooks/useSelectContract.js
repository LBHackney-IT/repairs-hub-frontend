import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'

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
        setContractors(res)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoadingContractors(false)
      })
  }, [])

  const { data: contractsData, isLoading: isLoadingContracts } = useQuery(
    ['contracts', selectedContractor?.contractorReference],
    () =>
      selectedContractor
        ? fetchContracts(true, selectedContractor.contractorReference)
        : Promise.resolve([]),
    {
      enabled: !!selectedContractor, // Only run when a contractor is selected
    }
  )

  useEffect(() => {
    setLoadingContracts(isLoadingContracts)
    if (contractsData) {
      const contractReferences = contractsData.map(
        (contract) => contract.contractReference
      )
      setContracts(contractReferences)
    } else {
      setContracts(null)
    }
  }, [contractsData, isLoadingContracts])

  const handleSelectContractor = (e) => {
    const contractorName = e.target.value
    const selectedContractor = contractors.find(
      (contractor) => contractor.contractorName === contractorName
    )

    setSelectedContractor(selectedContractor || null)
  }

  const handleSelectContract = (e) => {
    setSelectedContract(e.target.value)
  }

  const handleFormReset = () => {
    setSelectedContractor(null)
    setSelectedContract(null)
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
    handleFormReset,
  }
}

export default useSelectContract
