import { useQuery } from 'react-query'
import { useMemo, useState } from 'react'
import { fetchContracts } from '@/root/src/utils/requests/contract'

import Layout from '../../BackOffice/Layout'
import SorSearch from '../SorSearch'

import ContractSection from '../Contract/ContractSection'

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
    () =>
      fetchContracts({
        isActive: true,
        contractorReference: contractorReference,
        sorCode: null,
      })
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
    () =>
      fetchContracts({
        isActive: false,
        contractorReference: contractorReference,
        sorCode: null,
      })
  )
  const {
    data: contractsWithSorCode,
    isLoading: sorContractsIsLoading,
    refetch: refetchSorContracts,
    error: sorContractsError,
  } = useQuery(
    ['sorContracts', contractorReference, sorCode?.toLocaleUpperCase()],
    () =>
      fetchContracts({
        isActive: null,
        contractorReference: contractorReference,
        sorCode: sorCode?.toLocaleUpperCase(),
      }),
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
      <ContractSection
        contracts={activeContracts}
        heading="Active contracts:"
        isLoading={activeContractsLoading}
        warningText={`No active contracts found for ${contractorName}.`}
        error={activeContractsError}
        page="contractor"
        activeStatus="active"
      />

      <ContractSection
        contracts={relativeInactiveContracts}
        heading="Inactive contracts (from 2020):"
        isLoading={inactiveContractsLoading}
        warningText={`No inactive contracts found for ${contractorName}.`}
        error={inactiveContractsError}
        page="contractor"
        activeStatus="inactive"
      />

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
