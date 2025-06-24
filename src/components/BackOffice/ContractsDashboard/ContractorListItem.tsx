import Link from 'next/link'
import cx from 'classnames'

import { dateToStr } from '@/root/src/utils/date'
import Contract from '@/root/src/models/contract'

interface ContractorListItemProps {
  contractorReference: Contract['contractorReference']
}

const ContractorListItem = ({
  contractorReference,
}: ContractorListItemProps) => {
  return (
    // <Link
    //   href={`/backoffice/contracts/${contractorReference.contractReference}`}
    // >
    <li
      style={{
        cursor: 'pointer',
        border: '5px solid #00664F',
        borderRadius: '20px',
        width: '85%',
      }}
      className={cx('govuk-!-margin-top-3', 'operative-work-order-list-item')}
    >
      <div className="contract-details">
        <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
          Reference:{' '}
        </h3>
        <p className="govuk-!-margin-0 govuk-!-margin-bottom-1">
          <strong>Contractor:</strong>{' '}
        </p>
        <p className="govuk-!-margin-0 govuk-!-margin-bottom-1">
          <strong>Contractor Code:</strong>
        </p>
        <p className="govuk-!-margin-0 govuk-!-margin-bottom-1">
          <strong>Active:</strong>
        </p>
        <p className="govuk-!-margin-0 govuk-!-margin-bottom-1">
          <strong>Count of SORs:</strong>
        </p>
        <p className="govuk-!-margin-0">
          <strong>Sum of SORs:</strong>
        </p>
      </div>
      <div className="govuk-!-margin-0">
        <span className="arrow right"></span>
      </div>
    </li>
    // </Link>
  )
}

export default ContractorListItem
