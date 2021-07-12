import PropTypes from 'prop-types'
import Link from 'next/link'
import Panel from '../../Template/Panel'

const CancelWorkOrderFormSuccess = ({
  workOrderReference,
  propertyReference,
  shortAddress,
}) => {
  return (
    <>
      <Panel
        title="Repair work order cancelled"
        workOrderReference={workOrderReference}
      />

      <ul className="lbh-list govuk-!-margin-top-9">
        <li>
          <Link href={`/properties/${propertyReference}/raise-repair/new`}>
            <a className="lbh-link">
              <strong>New repair for {shortAddress}</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href="/">
            <a className="lbh-link">
              <strong>Start a new search</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href={`/work-orders/${workOrderReference}`}>
            <a className="lbh-link">
              <strong>Back to work order</strong>
            </a>
          </Link>
        </li>
      </ul>
    </>
  )
}

CancelWorkOrderFormSuccess.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  workOrderReference: PropTypes.string.isRequired,
  shortAddress: PropTypes.string.isRequired,
}

export default CancelWorkOrderFormSuccess
