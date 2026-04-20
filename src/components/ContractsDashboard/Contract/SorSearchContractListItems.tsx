import Contract from '@/root/src/models/contract'
import { SorSearchContractListItem } from './SorSearchContractListItem'
import { ContractListItems } from './ContractListItems'

interface Props {
  contracts: Contract[]
  warningText?: string
  error?: Error | string | null
  activeStatus?: string
}

export const SorSearchContractListItems = (props: Props) => {
  const { contracts } = props

  return (
    <ContractListItems {...props}>
      {contracts?.map((contract, index) => (
        <SorSearchContractListItem
          key={contract.contractReference}
          contract={contract}
          index={index}
        />
      ))}
    </ContractListItems>
  )
}
