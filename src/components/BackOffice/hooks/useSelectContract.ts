import { ChangeEvent, useState, useEffect } from 'react'
import { useQuery } from 'react-query'

import { fetchContractors } from '../requests'
import { fetchContracts } from '@/root/src/utils/requests/contract'

export interface Contractor {
  contractorReference: string
  contractorName: string
}

const useSelectContract = () => {
  const [contractors, setContractors] = useState<Contractor[] | null>(null)
  const [
    selectedContractor,
    setSelectedContractor,
  ] = useState<Contractor | null>(null)

  const [selectedContract, setSelectedContract] = useState<string | null>(null)

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
        ? fetchContracts({
            isActive: true,
            contractorReference: selectedContractor.contractorReference,
            sorCode: null,
          })
        : Promise.resolve([]),
    {
      enabled: !!selectedContractor, // Only run when a contractor is selected
    }
  )

  const contractReferences = contractsData
    ? contractsData.map((contract) => contract.contractReference)
    : null

  const handleSelectContractor = (e: ChangeEvent<HTMLInputElement>) => {
    const contractorName = e.target.value
    const selectedContractor = contractors.find(
      (contractor) => contractor.contractorName === contractorName
    )

    setSelectedContractor(selectedContractor || null)
  }

  useEffect(() => {
    if (selectedContractor === null) {
      setSelectedContract(null)
    }
  }, [selectedContractor])

  const handleSelectContract = (e: ChangeEvent<HTMLInputElement>) => {
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
    contracts: contractReferences,
    selectedContract,
    loadingContracts: isLoadingContracts,
    loadingContractors,
    handleSelectContract,
    handleFormReset,
  }
}

export default useSelectContract
