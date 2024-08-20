import PropTypes from 'prop-types'
import { usePropertyBoilerHouse } from '../../../hooks/usePropertyBoilerHouse'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'

const renderLegalDisrepair = (isInLegalDisrepair) => {
  return (
    isInLegalDisrepair && (
      <WarningInfoBox
        header="This property is currently under legal disrepair"
        text="Before raising a work order you must call the Legal Disrepair Team"
      />
    )
  )
}

const PropertyBoilerHouseDetails = ({ boilerHouseId }) => {
  const { loading, boilerHouse, boilerHouseError } = usePropertyBoilerHouse(
    boilerHouseId
  )

  {loading ? <Spinner resource="propertyBoilerHouseDetails"/> : renderLegalDisrepair(isInLegalDisrepair)}

  if (boilerHouseError) return <ErrorMessage label={boilerHouseError} />

  return (
    <li className="bg-dark-green" data-testid="boiler-house-details">
      BoilerHouse:{' '}
      <a
        data-testid="boiler-house-details-link"
        className="govuk-link"
        style={{
          color: 'white',
        }}
        href={`/properties/${boilerHouse.propertyReference}`}
      >
        {boilerHouse.addressLine1}
      </a>
    </li>
  )
}

PropertyBoilerHouseDetails.propTypes = {
  boilerHouseId: PropTypes.string.isRequired,
}

export default PropertyBoilerHouseDetails
