import { useEffect, useState } from 'react'

import Layout from '../../Layout'
import Spinner from '../../../Spinner'
import ErrorMessage from '../../../Errors/ErrorMessage'
import WarningInfoBox from '../../../Template/WarningInfoBox'
import Contract from '@/root/src/models/contract'
import { fetchContract } from '@/root/src/components/BackOffice/requests'
import { dateToStr } from '@/root/src/utils/date'

interface ContractViewProps {
  contractReference: string
}

const ContractView = ({ contractReference }: ContractViewProps) => {
  const [contract, setContract] = useState<null | Contract>(null)
  const [error, setError] = useState<string | null>()
  const [isLoading, setLoading] = useState(true)

  const getContract = async () => {
    const contractResponse = await fetchContract(contractReference)

    if (!contractResponse.success) {
      setError(contractResponse.error?.message)
      setLoading(false)
      return
    }
    setContract(contractResponse.response)
    setLoading(false)
  }

  useEffect(() => {
    getContract()
  }, [])

  return (
    <Layout title={`Contract: ${contractReference}`}>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage label={error} />
      ) : contract ? (
        <>
          <p>{`Contractor reference: ${contract.contractorReference}`}</p>
          <p>{`Expiration date: ${dateToStr(contract.terminationDate)}`}</p>
          <p>{`Start date: ${dateToStr(contract.effectiveDate)}`}</p>
          <p>{`Is raisable: ${contract.isRaisable.toString()}`}</p>
        </>
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
