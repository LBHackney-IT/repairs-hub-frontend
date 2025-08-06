import { useQuery } from 'react-query'

import Layout from '../Layout'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import ContractorsListItems from './Contractor/ContractorsListItems'
import ContractListItems from './Contract/ContractListItems'
import {
  fetchContracts,
  backOfficeFetchContractors,
} from '@/root/src/components/BackOffice/requests'

import { filterContractsByExpiryDate, today } from './utils'

import Contract from '@/root/src/models/contract'
import Contractor from '@/root/src/models/contractor'

const ContractsDashboard = () => {
  const {
    data: contractData,
    isLoading: contractsIsLoading,
    error: contractsError,
  } = useQuery(
    ['contracts', { isActive: null, contractorReference: null, sorCode: null }],
    () =>
      fetchContracts({
        isActive: null,
        contractorReference: null,
        sorCode: null,
      })
  )

  const {
    data: contractorsData,
    isLoading: contractorsIsLoading,
    error: contractorsError,
  } = useQuery(
    ['contractors', { contractsExpiryFilterDate: '2020, 1, 1' }],
    () =>
      backOfficeFetchContractors({
        contractsExpiryFilterDate: new Date(2020, 0, 1),
      })
  )

  const contracts = contractData as Contract[] | null
  const contractors = contractorsData as Contractor[] | null
  const contractError = contractsError as Error | null
  const contractorError = contractorsError as Error | null

  const contractsThatExpireWithinTwoMonths = filterContractsByExpiryDate(
    contracts,
    2,
    today
  )

  return (
    <Layout title="Contracts Dashboard">
      <>
        <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
          Contracts due to expire soon:
        </h3>

        {contractsIsLoading ? (
          <>
            <Spinner />
          </>
        ) : (
          contractsThatExpireWithinTwoMonths && (
            <ContractListItems
              contracts={contractsThatExpireWithinTwoMonths}
              warningText="No contracts expiring in the next two months."
              page="dashboard"
            />
          )
        )}
        {contractError && (
          <ErrorMessage
            label={
              contractError instanceof Error
                ? contractError.message
                : typeof contractError === 'string'
                ? contractError
                : 'An unexpected error occurred'
            }
          />
        )}

        <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
          Contractors:
        </h3>
        {contractorsIsLoading ? (
          <>
            <Spinner />
          </>
        ) : (
          contractors && <ContractorsListItems contractors={contractors} />
        )}
        {contractorError && (
          <ErrorMessage
            label={
              contractorError instanceof Error
                ? contractorError.message
                : typeof contractorError === 'string'
                ? contractorError
                : 'An unexpected error occurred'
            }
          />
        )}
      </>
    </Layout>
  )
}

export default ContractsDashboard
