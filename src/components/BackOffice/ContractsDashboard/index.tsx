import { useQuery } from 'react-query'

import Layout from '../Layout'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import WarningInfoBox from '../../Template/WarningInfoBox'
import ContractorsListItems from './ContractorsListItems'
import ContractListItems from './Contract/ContractListItems'
import { fetchContracts } from '@/root/src/components/BackOffice/requests'

import Contract from '@/root/src/models/contract'

const ContractsDashboard = () => {
  const { data, isLoading, error } = useQuery(
    ['contracts', { isActive: null, contractorReference: null }],
    () => fetchContracts(null, null)
  )

  const contracts = data as Contract[] | null

  if (isLoading) {
    return (
      <Layout title="Contracts Dashboard">
        <Spinner />
      </Layout>
    )
  }

  if (error) {
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
      {contracts?.length ? (
        <>
          <ContractListItems contracts={contracts} />
          <ContractorsListItems contracts={contracts} />
        </>
      ) : (
        <WarningInfoBox
          header="No contracts found"
          name="No contracts warning"
        />
      )}
    </Layout>
  )
}

export default ContractsDashboard
