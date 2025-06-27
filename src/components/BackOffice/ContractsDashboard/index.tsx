import { useQuery } from 'react-query'

import Layout from '../Layout'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import ContractorsListItems from './Contractor/ContractorsListItems'
import ContractListItems from './Contract/ContractListItems'
import { fetchContracts } from '@/root/src/components/BackOffice/requests'

import Contract from '@/root/src/models/contract'

const ContractsDashboard = () => {
  const { data, isLoading, error } = useQuery(
    ['contracts', { isActive: null, contractorReference: null }],
    () => fetchContracts()
  )

  const contracts = data as Contract[] | null
  const contractError = error as Error | null

  const today = new Date()
  const contractExpiryCutOffDate = new Date(
    today.getFullYear(),
    today.getMonth() + 2,
    today.getDate()
  )
  const filteredContracts = contracts?.filter((contract) => {
    return (
      new Date(contract.terminationDate) > today &&
      new Date(contract.terminationDate) < contractExpiryCutOffDate
    )
  })

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
        {filteredContracts && (
          <ContractListItems
            contracts={filteredContracts}
            heading="Contracts due to expire soon:"
            warningText="No contracts expiring in the next two months."
          />
        )}
        {contracts && <ContractorsListItems contracts={contracts} />}
      </>
    </Layout>
  )
}

export default ContractsDashboard
