import Contract from '@/root/src/models/contract'
import { JSX } from 'react'
import { DashboardContractListItems } from '../DashboardContractListItems'
import { NoContractsFoundMessage } from './NoContractsFoundMessage'
import { ContractsSectionWrapper } from './ContractSection'
import { DashboardContractsGroupedByContractor } from '../DashboardContractsGroupedByContractor'

interface Props {
  heading?: string
  contracts: Contract[]
  isLoading: boolean
  warningText: string | JSX.Element
  error: Error
  activeStatus?: string
}

export type ContractorWithContracts = {
     contracts: Contract[]
    contractor: {
      name: string
      reference: string
    }
}

export type ContractsByContractor = {
  [key: string]: ContractorWithContracts
}

export const DashboardContractSection = ({
  heading,
  contracts,
  isLoading,
  warningText,
  error,
  activeStatus,
}: Props) => {
  const groupContractsByContractor = (contracts: Contract[]) => {
    const contractsByContractor: ContractsByContractor = {}

    // console.log({contracts})

    contracts?.forEach((contract) => {
      if (contractsByContractor.hasOwnProperty(contract.contractorReference)) {
        contractsByContractor[contract.contractorReference].contracts.push(
          contract
        )
        return
      }

      contractsByContractor[contract.contractorReference] = {
        contractor: {
          name: contract.contractorName,
          reference: contract.contractorReference,
        },
        contracts: [contract],
      }
    })

    // return contractsByContractor

    return Object.keys(contractsByContractor).map(x => contractsByContractor[x])
    .sort((a, b) => {
        if (a.contractor.name < b.contractor.name) return -1
        if (a.contractor.name > b.contractor.name) return 1
        return 0
    })

    // const contractsByContractor: {[ key: string]: Contract[] } = Object.assign({}, ...contracts.map((x) => ({[x.]: x.country})))
  }

  const contractsGroupedByContractor = groupContractsByContractor(contracts)

  return (
    <>
      <ContractsSectionWrapper
        heading={heading}
        isLoading={isLoading}
        error={error}
      >
        <>
          {contracts && contracts?.length > 0 && (
            <DashboardContractsGroupedByContractor
              contracts={contractsGroupedByContractor}
              
            //   activeStatus={activeStatus}
            />
          )}

          {contracts === null ||
            (contracts?.length === 0 && (
              <NoContractsFoundMessage warningText={warningText} />
            ))}
        </>
      </ContractsSectionWrapper>
    </>
  )
}
