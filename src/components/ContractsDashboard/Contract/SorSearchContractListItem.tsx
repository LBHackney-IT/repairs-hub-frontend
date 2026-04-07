import Contract from '@/root/src/models/contract'
import { dateToStr } from '@/root/src/utils/date'
import { ContractListItem } from './ContractListItem'

interface Props {
  contract: Contract
  index: number
}

export const SorSearchContractListItem = (props: Props) => {
  const { contract } = props

  return (
    <ContractListItem {...props}>
      {contract.terminationDate < new Date().toISOString() ? (
        <p style={{ color: 'red' }}>
          Expired: {dateToStr(contract.terminationDate)}
        </p>
      ) : (
        <p style={{ color: 'green' }}>Active</p>
      )}
    </ContractListItem>
  )
}
