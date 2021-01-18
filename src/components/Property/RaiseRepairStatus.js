import PropTypes from 'prop-types'
import Link from 'next/link'

const RaiseRepairStatus = ({
  canRaiseRepair,
  description,
  propertyReference,
}) => {
  if (canRaiseRepair) {
    return (
      <span className="govuk-heading-m text-green">
        <Link href={`/properties/${propertyReference}/raise-repair/new`}>
          <a>
            <strong>Raise a repair on this {description.toLowerCase()}</strong>
          </a>
        </Link>
      </span>
    )
  } else {
    return (
      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">
          !
        </span>
        <strong className="govuk-warning-text__text">
          <span className="govuk-warning-text__assistive">Warning</span>
          Cannot raise a repair on this property due to tenure type
        </strong>
      </div>
    )
  }
}

RaiseRepairStatus.propTypes = {
  canRaiseRepair: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  propertyReference: PropTypes.string.isRequired,
}

export default RaiseRepairStatus
