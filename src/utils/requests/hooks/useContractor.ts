import Contractor from '@/root/src/models/contractor'
import { useEffect, useState } from 'react'
import { getContractor } from '../contractor'

export const useContractor = (contractorReference: string) => {
  const [contractor, setContractor] = useState<Contractor>()
  const [error, setError] = useState<string | null>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loadContractor = async () => {
    setError(null)
    setIsLoading(true)

    const getContractorResponse = await getContractor(contractorReference)

    if (!getContractorResponse.success) {
      setError(getContractorResponse.error.message)
    } else {
      setContractor(getContractorResponse.response)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadContractor()
  }, [])

  return { contractor, error, isLoading }
}
