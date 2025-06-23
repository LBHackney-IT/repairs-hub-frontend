import { useQuery } from 'react-query'

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
  const { data, isLoading, error } = useQuery('contracts', () =>
    fetchContract(contractReference)
  )

  const contract = data as Contract | null

  return (
    <Layout title={`Contract: ${contractReference}`}>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage label={error as string | null} />
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
