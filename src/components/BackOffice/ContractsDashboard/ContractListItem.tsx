import Link from 'next/link'
import cx from 'classnames'

import { dateToStr } from '@/root/src/utils/date'
import Contract from '@/root/src/models/contract'

interface ContractListItemProps {
  contract: Contract
  index: number
}

const ContractListItem = ({ contract, index }: ContractListItemProps) => {
  return (
    <Link href={`/backoffice/contracts/${contract.contractReference}`}>
      <li
        data-id={index}
        style={{ cursor: 'pointer' }}
        className={cx('govuk-!-margin-top-3', 'operative-work-order-list-item')}
      >
        <div className="appointment-details">
          <div>
            <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-0 govuk-!-margin-bottom-2">
              Contract Reference: {`${contract.contractReference}`}
            </h3>
          </div>
          <h4 className="lbh-heading-h4 govuk-!-margin-0 govuk-!-margin-bottom-2 capitalize">
            {`Contractor: ${contract.contractorName}`}
          </h4>
          <h4 className="lbh-heading-h4 govuk-!-margin-0 govuk-!-margin-bottom-2">
            {`Contractor code: ${contract.contractorReference}`}
          </h4>
          <h4
            className={cx(
              'lbh-body govuk-!-margin-0 govuk-!-margin-bottom-2 capitalize'
            )}
          >
            {`Contract start date: ${dateToStr(contract.effectiveDate)}`}
          </h4>
          <h4
            className={cx(
              'lbh-body govuk-!-margin-0 govuk-!-margin-bottom-2 capitalize'
            )}
          >
            {`Contract expiry date: ${dateToStr(contract.terminationDate)}`}
          </h4>
          <h4
            className={cx(
              'lbh-body govuk-!-margin-0 govuk-!-margin-bottom-2 capitalize'
            )}
          >
            {`Count of SORs: ${contract.sorCount}`}
          </h4>
          <h4
            className={cx(
              'lbh-body govuk-!-margin-0 govuk-!-margin-bottom-2 capitalize'
            )}
          >
            {`Sum of SORs ${contract.sorCost}`}
          </h4>
        </div>
        <div className="govuk-!-margin-0">
          <span className="arrow right"></span>
        </div>
      </li>
    </Link>
  )
}

export default ContractListItem
