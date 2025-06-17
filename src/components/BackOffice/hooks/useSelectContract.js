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
        setContractors(res)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoadingContractors(false)
      })
  }, [])

  const getContracts = async () => {
    const contractsResponse = await fetchContracts(
      true,
      selectedContractor.contractorReference
    )

    const contractReferences = contractsResponse.response.map((contract) => {
      return contract.contractReference
    })
    setContracts(contractReferences)
  }

  useEffect(() => {
    if (selectedContractor === null) {
      setContracts(null)
      setSelectedContract(null)
      return
    }

    getContracts()

    setLoadingContracts(true)

    setLoadingContracts(false)
  }, [selectedContractor])

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
