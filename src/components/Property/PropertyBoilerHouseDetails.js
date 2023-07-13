import PropTypes from 'prop-types'
import { usePropertyBoilerHouse } from '../../hooks/usePropertyBoilerHouse'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'

const PropertyBoilerHouseDetails = ({ boilerHouseId }) => {
  const { loading, boilerHouse, boilerHouseError } = usePropertyBoilerHouse(
    boilerHouseId
  )

  if (loading) return <Spinner resource="propertyBoilerHouseDetails" />

  if (boilerHouseError) return <ErrorMessage label={boilerHouseError} />

  return (
    <>
      {boilerHouse !== null && (
        <li className="bg-dark-green">
          BoilerHouse:{' '}
          <a
            className="govuk-link"
            style={{
              color: 'white',
            }}
            href={`/properties/${boilerHouse.propertyReference}`}
          >
            {boilerHouse.addressLine1}
          </a>
        </li>
      )}
    </>
  )
}

PropertyBoilerHouseDetails.propTypes = {
  boilerHouseId: PropTypes.string.isRequired,
}

export default PropertyBoilerHouseDetails
