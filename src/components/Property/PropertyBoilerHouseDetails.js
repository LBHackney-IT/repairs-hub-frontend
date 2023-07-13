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
    <div>
      {boilerHouse !== null && (
        <div
          style={{
            background: '#00664f',
            color: 'white',
            padding: '4px 8px',
            margin: '15px 0',
            fontSize: '1rem',
            display: 'inline-block',
          }}
        >
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
        </div>
      )}
    </div>
  )
}

PropertyBoilerHouseDetails.propTypes = {
  boilerHouseId: PropTypes.string.isRequired,
}

export default PropertyBoilerHouseDetails
