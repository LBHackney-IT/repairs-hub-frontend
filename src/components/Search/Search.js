import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import UserContext from '../UserContext/UserContext'
import PropertiesTable from '../Properties/PropertiesTable'
import { PrimarySubmitButton } from '../Form'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { getProperties } from '../../utils/frontend-api-client/properties'

const Search = ({ query }) => {
  const { user } = useContext(UserContext)
  const isContractor = user && user.hasContractorPermissions
  const [searchQuery, setSearchQuery] = useState('')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const router = useRouter()
  const workOrderReferenceRegex = /[0-9]{8}/g

  const searchHeadingText = isContractor
    ? 'Find repair job'
    : 'Find repair job or property'
  const searchLabelText = isContractor
    ? 'Search by work order reference'
    : 'Search by work order reference, postcode or address'

  useEffect(() => {
    if (query) {
      if (workOrderReferenceRegex.test(query) || isContractor) {
        workOrderUrl(decodeURI(query.q))
      } else {
        setSearchQuery(decodeURI(query.q))
        searchForProperties(query.q)
      }
    }
  }, [])

  const searchForProperties = async (searchQuery) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getProperties(searchQuery)
      setProperties(data)
    } catch (e) {
      setProperties(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (workOrderReferenceRegex.test(searchQuery) || isContractor) {
      workOrderUrl(searchQuery)
    } else {
      propertiesURL(searchQuery)
      searchQuery && searchForProperties(searchQuery)
    }
  }

  const propertiesURL = (searchQuery) => {
    router.push({
      pathname: '/search',
      query: {
        q: encodeURI(searchQuery),
      },
    })
  }

  const workOrderUrl = (searchQuery) => {
    router.push(`/work-orders/${searchQuery}`)
  }

  return (
    <div>
      <section className="section">
        <h1 className="govuk-heading-m">{searchHeadingText}</h1>

        <div className="govuk-form-group">
          <form>
            <label className="govuk-label">
              <p className="govuk-body-s govuk-!-margin-bottom-0">
                {searchLabelText}
              </p>
              <input
                type="text"
                className="govuk-input govuk-input--width-10 focus-colour govuk-!-margin-bottom-5"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <PrimarySubmitButton label="Search" onClick={handleSubmit} />
          </form>
        </div>
      </section>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {properties?.length > 0 && (
            <PropertiesTable properties={properties} query={searchQuery} />
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </div>
  )
}

export default Search
