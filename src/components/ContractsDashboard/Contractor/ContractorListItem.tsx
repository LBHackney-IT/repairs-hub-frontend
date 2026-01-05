import Link from 'next/link'
import cx from 'classnames'

interface ContractorListItemProps {
  contractorReference: string
  contractorName: string
  activeContractCount: number
}

const ContractorListItem = ({
  contractorReference,
  contractorName,
  activeContractCount,
}: ContractorListItemProps) => {
  return (
    <Link
      href={{
        pathname: `/contractors/${contractorReference}`,
      }}
      style={{
        textDecoration: 'none !important',
      }}
    >
      <li
        style={{
          cursor: 'pointer',
          padding: '1.5rem',
          borderRadius: '20px',
          width: '85%',
          ...(activeContractCount
            ? { backgroundColor: '#D4EDDA' }
            : { backgroundColor: '#F0F0F0' }),
        }}
        className={cx('govuk-!-margin-top-3', 'operative-work-order-list-item')}
      >
        <div className="contract-details">
          <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
            {`${contractorName}`}
          </h3>
          <p>
            Active contracts:{' '}
            <span style={{ fontWeight: 800 }}>{activeContractCount}</span>
          </p>
        </div>
        <div className="govuk-!-margin-0">
          <span className="arrow right"></span>
        </div>
      </li>
    </Link>
  )
}
export default ContractorListItem
