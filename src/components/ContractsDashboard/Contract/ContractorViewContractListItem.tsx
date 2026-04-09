import Contract from '@/root/src/models/contract'
import { ContractListItem } from './ContractListItem'
import { dateToStr } from '@/root/src/utils/date'

interface Props {
  contract: Contract
  index: number
}

export const ContractorViewContractListItem = (props: Props) => {
  const { contract } = props

  return (
    <ContractListItem {...props}>
      <>
        <p>
          <span style={{ fontWeight: '600' }}>Sum of SORs:</span>{' '}
          {Intl.NumberFormat('en-UK', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(contract.sorCost)}
        </p>
        <p>
          <span style={{ fontWeight: '600' }}>SOR Count:</span>{' '}
          {contract.sorCount}
        </p>

        <p>
          {contract.terminationDate < new Date().toISOString()
            ? `Expired: `
            : `Expires: `}
          <span style={{ fontWeight: '600' }}>
            {dateToStr(contract.terminationDate)}
          </span>
        </p>
      </>
    </ContractListItem>
  )
}
