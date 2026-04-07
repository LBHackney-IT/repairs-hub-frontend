import Contract from '@/root/src/models/contract'
import { dateDiffRoundedUp } from './ContractExpiryDisplay'
import { dateToStr } from '@/root/src/utils/date'
import { ContractListItem } from './ContractListItem'

interface Props {
  contract: Contract
  index: number
}

export const DashboardContractListItem = (props: Props) => {
  const { contract } = props

  return (
    <ContractListItem {...props}>
      <>
        <p>{contract.contractorName}</p>

        {contract.terminationDate < new Date().toISOString() ? (
          <p>
            Expired:{' '}
            <span style={{ fontWeight: '600' }}>
              {dateDiffRoundedUp(contract)} days ago
            </span>
          </p>
        ) : (
          <p>
            Expires:{' '}
            <span style={{ fontWeight: '600' }}>
              {dateToStr(contract.terminationDate)}
            </span>
          </p>
        )}
      </>
    </ContractListItem>
  )
}
