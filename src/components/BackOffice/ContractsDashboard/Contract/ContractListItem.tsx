import cx from 'classnames'
import { dateToStr } from '@/root/src/utils/date'

const ContractListItem = ({ contract, index }) => {
  return (
    <>
      <li
        data-id={index}
        style={{
          cursor: 'pointer',
          border: '5px solid #00664F',
          borderRadius: '20px',
          width: '85%',
        }}
        className={cx('govuk-!-margin-top-3', 'operative-work-order-list-item')}
      >
        <div className="contract-details">
          <p key={index}>
            {`${contract.contractReference} |  ${
              contract.contractorName
            } | ${dateToStr(contract.terminationDate)}`}
          </p>
        </div>
      </li>
    </>
  )
}

export default ContractListItem
