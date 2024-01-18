import BackButton from '../../Layout/BackButton'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Spinner from '../../Spinner'
import { frontEndApiRequest } from '../../../utils/frontEndApiClient/requests'
import ErrorMessage from '../../Errors/ErrorMessage'
import DampAndMouldReportsPropertyReportsView from '../views/DampAndMouldReportsPropertyReportsView'

const DampAndMouldReportsPropertyViewLayout = ({ propertyReference }) => {
  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)

    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${propertyReference}`,
    })
      .then((propertyResponse) => {
        setProperty(propertyResponse.property.address.addressLine)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <>
      <BackButton />

      <h1 className="lbh-heading-h1">Damp and Mould reports</h1>

      {error && <ErrorMessage label={error} />}

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <h2 className="lbh-heading-h2" style={{ marginTop: '30px' }}>
            <Link href={`properties/${propertyReference ?? null}`}>
              {property ?? ''}
            </Link>
          </h2>

          <DampAndMouldReportsPropertyReportsView
            propertyReference={propertyReference}
          />
        </>
      )}
    </>
  )
}

export default DampAndMouldReportsPropertyViewLayout
