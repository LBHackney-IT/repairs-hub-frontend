import { useEffect, useState } from 'react'

import Layout from '../../Layout'
import Spinner from '../../../Spinner'
import ErrorMessage from '../../../Errors/ErrorMessage'
import WarningInfoBox from '../../../Template/WarningInfoBox'
import Contract from '@/root/src/models/contract'
import { getContract } from '@/root/src/utils/requests/contracts'
import ContractInformationView from './ContractInformationView'

interface ContractViewProps {
  contractReference: string
}

const ContractView = ({ contractReference }: ContractViewProps) => {
  const [contract, setContract] = useState<null | Contract>(null)
  const [error, setError] = useState<string | null>()
  const [isLoading, setLoading] = useState(true)

  const fetchContract = async () => {
    const contractResponse = await getContract(contractReference)

    if (!contractResponse.success) {
      setError(contractResponse.error?.message)
      setLoading(false)
      return
    }
    setContract(contractResponse.response)
    setLoading(false)
  }

  useEffect(() => {
    fetchContract()
  }, [])

  return (
    <Layout title={`Contract: ${contractReference}`}>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage label={error} />
      ) : contract ? (
        <ContractInformationView contract={contract} />
      ) : (
        <WarningInfoBox
          header="Contract not found"
          name="No contracts warning"
        />
      )}
    </Layout>
  )
}

export default ContractView
