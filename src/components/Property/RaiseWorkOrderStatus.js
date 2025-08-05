import PropTypes from 'prop-types'
import Link from 'next/link'
import WarningText from '../Template/WarningText'

const RaiseWorkOrderStatus = ({
  canRaiseRepair,
  description,
  propertyReference,
}) => {
  if (!canRaiseRepair) {
    return (
      <WarningText text="Cannot raise a work order on this property due to tenure type" />
    )
  }

  return (
    <>
      <span className="lbh-heading-h3 text-green">
        <Link href={`/properties/${propertyReference}/raise-repair/new`}>
          <a className="lbh-link">
            <strong>
              Raise a work order
            </strong>
          </a>
        </Link>
      </span>

      <span className="lbh-heading-h3 text-green" style={{marginTop: "15px"}}>
        <Link href={`/properties/${propertyReference}/raise-repair/repairs-finder`}>
          <a className="lbh-link">
            <strong>
              Import work order details from Repairs Finder
            </strong>
          </a>
        </Link>
      </span>
    </>
  )
}

RaiseWorkOrderStatus.propTypes = {
  canRaiseRepair: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  propertyReference: PropTypes.string.isRequired,
}

export default RaiseWorkOrderStatus
