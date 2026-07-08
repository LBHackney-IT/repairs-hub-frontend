import { useQuery } from 'react-query'
import { useMemo, useState } from 'react'
import { fetchContracts } from '@/root/src/utils/requests/contract'
import Layout from '../../BackOffice/Layout'
import SorSearch from '../SorSearch'
import Spinner from '../../Spinner'
import { ContractorContractSection } from '../Contract/ContractsSection/ContractorContractSection'

interface Props {
  contractorReference: string
}

const ContractorView = ({ contractorReference }: Props) => {
  const [sorCode, setSorCode] = useState<string>('')

  const {
    data: contracts,
    isLoading: isLoadingContracts,
    error: contractsError,
  } = useQuery(
    [
      'activeContracts',
      { isActive: true, contractorReference: contractorReference },
    ],
    () =>
      fetchContracts({
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

  // not ideal
  const contractorName = contracts?.[0]?.contractorName 

  const descendingDateContractsWithSorCode = useMemo(
    () => (contractsWithSorCode ? [...contractsWithSorCode].reverse() : null),
    [contractsWithSorCode]
  )

  const contractsWithSorCodeError = sorContractsError as Error | null


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    refetchSorContracts && refetchSorContracts()
  }

  if (
    isLoadingContracts ||
    sorContractsIsLoading
  ) {
    return <Spinner />
  }

  return (
    <Layout title={`${contractorName} ${contractorReference}`}>
      <ContractorContractSection
        contracts={[...contracts]}
        heading="All contracts"
        isLoading={isLoadingContracts}
        warningText={`No contracts found.`}
        error={contractsError as Error | null}
        activeStatus="active"
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
