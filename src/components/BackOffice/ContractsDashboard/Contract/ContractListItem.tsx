import cx from 'classnames'

import Contract from '@/root/src/models/contract'
import { dateToStr } from '@/root/src/utils/date'

interface ContractListItemProps {
  contract: Contract
  index: number
  page: string
}

const ContractListItem = ({ contract, index, page }: ContractListItemProps) => {
  return (
    <>
      <li
        data-id={index}
        style={{
          border: '5px solid #00664F',
          borderRadius: '20px',
          width: '85%',
        }}
        className={cx('govuk-!-margin-top-3', 'operative-work-order-list-item')}
      >
        <div className="contract-details">
          {page === 'contractor' && (
            <p key={index}>
              {contract.contractReference} |{' '}
              <span style={{ fontWeight: '600' }}>Sum of SORs:</span>{' '}
              {Intl.NumberFormat('en-UK', {
                style: 'currency',
                currency: 'GBP',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(contract.sorCost)}{' '}
              | <span style={{ fontWeight: '600' }}>SOR Count:</span>{' '}
              {contract.sorCount} | {dateToStr(contract.terminationDate)}
            </p>
          )}
          {page === 'dashboard' && (
            <p key={index}>
              {contract.contractReference} | {contract.contractorName} |{' '}
              Expires: {dateToStr(contract.terminationDate)}
            </p>
          )}
        </div>
      </li>
    </>
  )
}

export default ContractListItem
