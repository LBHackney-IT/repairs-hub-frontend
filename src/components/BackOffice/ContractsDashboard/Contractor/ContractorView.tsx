import { useQuery } from 'react-query'
import { useMemo, useState } from 'react'
import { fetchContracts } from '../../requests'

import Layout from '../../Layout'
import Spinner from '../../../Spinner'
import SorSearch from '../SorSearch'

import ContractListItems from '../Contract/ContractListItems'

import { filterRelativeInactiveContracts } from '../utils'

interface ContractorViewProps {
  contractorReference: string
}

const ContractorView = ({ contractorReference }: ContractorViewProps) => {
  const [sorCode, setSorCode] = useState<string>('')

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
  const {
    data: contractsWithSorCode,
    isLoading: sorContractsIsLoading,
    refetch: refetchSorContracts,
    error: sorContractsError,
  } = useQuery(
    ['sorContracts', contractorReference, sorCode?.toLocaleUpperCase()],
    () =>
      fetchContracts(null, contractorReference, sorCode?.toLocaleUpperCase()),
    {
      enabled: false,
    }
  )

  const contractorName =
    activeContracts?.[0]?.contractorName ||
    inactiveContracts?.[0]?.contractorName

  const descendingDateContractsWithSorCode = useMemo(
    () => (contractsWithSorCode ? [...contractsWithSorCode].reverse() : null),
    [contractsWithSorCode]
  )

  const activeContractsError = activeError as Error | null
  const inactiveContractsError = inactiveError as Error | null
  const contractsWithSorCodeError = sorContractsError as Error | null

  const relativeInactiveContracts = filterRelativeInactiveContracts(
    inactiveContracts,
    '2020'
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    refetchSorContracts()
  }
  return (
    <Layout title={`${contractorName} ${contractorReference}`}>
      {activeContractsLoading ? (
        <Spinner />
      ) : (
        activeContracts && (
          <ContractListItems
            contracts={activeContracts}
            heading="Active contracts:"
            warningText={`No active contracts found for ${contractorName}.`}
            error={activeContractsError}
            page="contractor"
            activeStatus="active"
          />
        )
      )}
      {inactiveContractsLoading ? (
        <Spinner />
      ) : (
        relativeInactiveContracts && (
          <ContractListItems
            contracts={relativeInactiveContracts}
            heading="Inactive contracts (from 2020):"
            warningText={`No inactive contracts found for ${contractorName}.`}
            error={inactiveContractsError}
            page="contractor"
            activeStatus="inactive"
          />
        )
      )}
      <SorSearch
        searchHeadingText={'Check an SOR code'}
        searchLabelText={`Find out which ${contractorName} contracts an SOR code exists in`}
        sorCode={sorCode}
        setSorCode={setSorCode}
        isLoading={sorContractsIsLoading}
        error={contractsWithSorCodeError}
        handleSubmit={(e: React.FormEvent) => handleSubmit(e)}
        contracts={descendingDateContractsWithSorCode}
        contractorName={contractorName}
      />
    </Layout>
  )
}

export default ContractorView
