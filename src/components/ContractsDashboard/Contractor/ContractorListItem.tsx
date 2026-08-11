import Link from 'next/link'
import cx from 'classnames'
import ContractDashboardContractor from '@/root/src/models/contractDashboardContractor'

interface Props {
  contractor: ContractDashboardContractor
}

const ContractorListItem = (props: Props) => {
  const {
    contractorReference,
    contractorName,
    activeContractCount,
    totalContractCount = 7 // placeholder
  } = props.contractor

  return (
    <Link
      href={{
        pathname: `/contractors/${contractorReference}`,
      }}
      style={{
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <li
        style={{
          cursor: 'pointer',
          padding: '20px',
          borderRadius: '5px',
          width: '100%',
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
          <p style={{marginTop: 10}}>
            Active contracts:{' '}
            <span style={{ fontWeight: 800 }}>{activeContractCount}</span>
          </p>
          <p style={{marginTop: 10}}>
            Inactive contracts:{' '}
            <span style={{ fontWeight: 800 }}>
              {totalContractCount - activeContractCount}
            </span>
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
