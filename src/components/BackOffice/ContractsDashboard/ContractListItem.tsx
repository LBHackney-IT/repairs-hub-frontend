import Link from 'next/link'
import cx from 'classnames'

import { dateToStr } from '@/root/src/utils/date'

const ContractListItem = ({ contract, index }) => {
  return (
    <Link href={`/backoffice/contracts/${contract.contractReference}`}>
      <li
        data-id={index}
        style={{ cursor: 'pointer' }}
        className={cx('govuk-!-margin-top-3', 'operative-work-order-list-item')}
      >
        <div className="appointment-details">
          <div>
            <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-0 govuk-!-display-inline">
              Contract Reference: {`${contract.contractReference}`}
            </h3>
          </div>
          <h4 className="lbh-heading-h4 govuk-!-margin-0 govuk-!-display-inline">
            {`Contractor Reference: ${contract.contractorReference}`}
          </h4>
          <p
            className={cx(
              'lbh-body govuk-!-margin-0 govuk-!-margin-bottom-2 capitalize'
            )}
          >
            {`Expiration Date: ${dateToStr(contract.terminationDate)}`}
          </p>
        </div>
        <div className="govuk-!-margin-0">
          <span className="arrow right"></span>
        </div>
      </li>
    </Link>
  )
}

export default ContractListItem
