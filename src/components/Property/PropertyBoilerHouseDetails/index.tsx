import { usePropertyBoilerHouse } from '../../../hooks/usePropertyBoilerHouse'
import ErrorMessage from '../../Errors/ErrorMessage'

interface Props {
  boilerHouseId: string
}

const PropertyBoilerHouseDetails = ({ boilerHouseId }: Props) => {
  const { boilerHouse, boilerHouseError } = usePropertyBoilerHouse(
    boilerHouseId
  )

  if (boilerHouseError) return <ErrorMessage label={boilerHouseError} />

  // Nothing to show until the boiler house has loaded
  if (!boilerHouse) return null

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

export default PropertyBoilerHouseDetails
