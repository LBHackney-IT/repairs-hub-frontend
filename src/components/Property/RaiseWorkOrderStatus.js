import PropTypes from 'prop-types'
import Link from 'next/link'
import WarningText from '../Template/WarningText'

const RaiseWorkOrderStatus = ({
  canRaiseRepair,
  description,
  propertyReference,
}) => {
  if (canRaiseRepair) {
    return (
      <span className="lbh-heading-h2 text-green">
        <Link href={`/properties/${propertyReference}/raise-repair/new`}>
          <a className="lbh-link">
            <strong>
              Raise a work order on this {description.toLowerCase()}
            </strong>
          </a>
        </Link>
      </span>
    )
  } else {
    return (
      <WarningText text="Cannot raise a work order on this property due to tenure type" />
    )
  }
}

RaiseWorkOrderStatus.propTypes = {
  canRaiseRepair: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  propertyReference: PropTypes.string.isRequired,
}

export default RaiseWorkOrderStatus
