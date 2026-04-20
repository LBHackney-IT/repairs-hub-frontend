import Contract from '@/root/src/models/contract'
import { ContractorViewContractListItem } from './ContractorViewContractListItem'
import { ContractListItems } from './ContractListItems'

interface Props {
  contracts: Contract[]
  warningText?: string
  error?: Error | string | null
  activeStatus?: string
}

export const ContractorViewContractListItems = (props: Props) => {
  const { contracts } = props

  return (
    <ContractListItems {...props}>
      {contracts?.map((contract, index) => (
        <ContractorViewContractListItem
          key={contract.contractReference}
          contract={contract}
          index={index}
        />
      ))}
    </ContractListItems>
  )
}
