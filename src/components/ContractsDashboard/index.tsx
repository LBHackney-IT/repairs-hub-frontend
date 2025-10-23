import { useQuery } from 'react-query'

import Layout from '../BackOffice/Layout'
import Spinner from '../Spinner'
import WarningInfoBox from '../Template/WarningInfoBox'
import ErrorMessage from '../Errors/ErrorMessage'
import ContractorsListItems from './Contractor/ContractorsListItems'
import ContractSection from './Contract/ContractSection'
import { fetchContractors } from '@/root/src/utils/requests/contractor'
import { fetchContracts } from '@/root/src/utils/requests/contract'

import {
  filterActiveContractsByExpiryDate,
  filterInactiveContractsByExpiryDate,
  today,
} from './utils'

import Contract from '@/root/src/models/contract'
import Contractor from '@/root/src/models/contractor'

const ContractsDashboard = () => {
  const {
    data: contractData,
    isLoading: contractsIsLoading,
    error: contractsError,
  } = useQuery(
    ['contracts', { isActive: true, contractorReference: null, sorCode: null }],
    () =>
      fetchContracts({
        isActive: true,
        contractorReference: null,
        sorCode: null,
      })
  )

  const {
    data: expiredContractData,
    isLoading: expiredContractsIsLoading,
    error: expiredContractsError,
  } = useQuery(
    [
      'contracts',
      { isActive: false, contractorReference: null, sorCode: null },
    ],
    () =>
      fetchContracts({
        isActive: false,
        contractorReference: null,
        sorCode: null,
      })
  )

  // Date used to filter contractors by the expiry date of their contracts. If the date is 01/01/2020, only contractors with contracts that expired on or after that date, or will expire in the future, will be shown.
  const CONTRACTS_CUTOFF_DATE = new Date(2020, 0, 1)

  const {
    data: contractorData,
    isLoading: contractorsIsLoading,
    error: contractorsError,
  } = useQuery(
    ['contractors', { contractsExpiryFilterDate: '2020, 0, 1' }],
    () =>
      fetchContractors({
        contractsExpiryFilterDate: CONTRACTS_CUTOFF_DATE,
      })
  )

  const contracts = contractData as Contract[] | null
  const contractors = contractorData as Contractor[] | null
  const expiredContracts = expiredContractData as Contract[] | null
  const contractError = contractsError as Error | null
  const contractorError = contractorsError as Error | null
  const expiredContractError = expiredContractsError as Error | null

  const contractsThatExpireWithinTwoMonths = filterActiveContractsByExpiryDate(
    contracts,
    2,
    today
  )

  const recentlyExpiredContracts = filterInactiveContractsByExpiryDate(
    expiredContracts,
    -1,
    today
  )

  return (
    <Layout title="Contracts Dashboard">
      <>
        <ContractSection
          heading="Contracts due to expire soon:"
          contracts={contractsThatExpireWithinTwoMonths}
          isLoading={contractsIsLoading}
          warningText="No contracts expiring in the next two months."
          error={contractError}
          page="dashboard"
        />

        <ContractSection
          heading="Contracts that have recently expired:"
          contracts={recentlyExpiredContracts}
          isLoading={expiredContractsIsLoading}
          warningText="No contracts have expired in the last month."
          error={expiredContractError}
          page="dashboard"
        />

        <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
          Contractors:
        </h3>
        {contractorsIsLoading ? (
          <>
            <Spinner />
          </>
        ) : contractors?.length === 0 || contractors === null ? (
          <div style={{ width: '85%' }}>
            <WarningInfoBox
              header="No contractors found!"
              name="no-contractors-found"
            />
          </div>
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
