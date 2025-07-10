import { useQuery } from 'react-query'

import Layout from '../Layout'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import ContractorsListItems from './Contractor/ContractorsListItems'
import ContractListItems from './Contract/ContractListItems'
import { fetchContracts } from '@/root/src/components/BackOffice/requests'

import { filterContractsByExpiryDate, today } from './utils'

import Contract from '@/root/src/models/contract'

const ContractsDashboard = () => {
  const { data, isLoading, error } = useQuery(
    ['contracts', { isActive: null, contractorReference: null, sorCode: null }],
    () =>
      fetchContracts({
        isActive: null,
        contractorReference: null,
        sorCode: null,
      })
  )

  const contracts = data as Contract[] | null
  const contractError = error as Error | null

  const contractsThatExpireWithinTwoMonths = filterContractsByExpiryDate(
    contracts,
    10,
    today
  )

  if (isLoading) {
    return (
      <Layout title="Contracts Dashboard">
        <Spinner />
      </Layout>
    )
  }
  if (contractError) {
    return (
      <Layout title="Contracts Dashboard">
        <ErrorMessage
          label={
            error instanceof Error
              ? error.message
              : typeof error === 'string'
              ? error
              : 'An unexpected error occurred'
          }
        />
      </Layout>
    )
  }

  return (
    <Layout title="Contracts Dashboard">
      <>
        {contractsThatExpireWithinTwoMonths && (
          <ContractListItems
            contracts={contractsThatExpireWithinTwoMonths}
            heading="Contracts due to expire soon:"
            warningText="No contracts expiring in the next two months."
            page="dashboard"
          />
        )}
        {contracts && <ContractorsListItems contracts={contracts} />}
      </>
    </Layout>
  )
}

export default ContractsDashboard
