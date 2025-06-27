import { useQuery } from 'react-query'
import { fetchContracts } from '../../requests'

import Layout from '../../Layout'
import Spinner from '../../../Spinner'

import ContractListItems from '../Contract/ContractListItems'

interface ContractorViewProps {
  contractorReference: string
  contractorName: string
}

const ContractorView = ({
  contractorReference,
  contractorName,
}: ContractorViewProps) => {
  const {
    data: activeContracts,
    isLoading: activeContractsLoading,
    error: activeError,
  } = useQuery(
    [
      'activeContracts',
      { isActive: true, contractorReference: contractorReference },
    ],
    () => fetchContracts(true, contractorReference)
  )

  const {
    data: inactiveContracts,
    isLoading: inactiveContractsLoading,
    error: inactiveError,
  } = useQuery(
    [
      'inactiveContracts',
      { isActive: false, contractorReference: contractorReference },
    ],
    () => fetchContracts(false, contractorReference)
  )
  const activeContractsError = activeError as Error | null
  const inactiveContractsError = inactiveError as Error | null

  const relativeInactiveContracts = inactiveContracts?.filter(
    (contract) =>
      contract.terminationDate > '2020' &&
      contract.terminationDate < new Date().toISOString()
  )

  return (
    <Layout title={`${contractorName}`}>
      <ol className="lbh-list mobile-working-work-order-list">
        {activeContractsLoading ? (
          <Spinner />
        ) : (
          activeContracts && (
            <ContractListItems
              contracts={activeContracts}
              heading="Active contracts:"
              warningText={`No active contracts found for ${contractorName}.`}
              error={activeContractsError}
            />
          )
        )}
      </ol>
      <ol className="lbh-list mobile-working-work-order-list">
        {inactiveContractsLoading ? (
          <Spinner />
        ) : (
          relativeInactiveContracts && (
            <ContractListItems
              contracts={relativeInactiveContracts}
              heading="Inactive contracts:"
              warningText={`No inactive contracts found for ${contractorName}.`}
              error={inactiveContractsError}
            />
          )
        )}
      </ol>
    </Layout>
  )
}

export default ContractorView
