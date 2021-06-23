import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import UserContext from '../UserContext/UserContext'
import PropertiesTable from '../Properties/PropertiesTable'
import { PrimarySubmitButton } from '../Form'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { getProperties } from '../../utils/frontend-api-client/properties'
import Meta from '../Meta'

const Search = ({ query }) => {
  const { user } = useContext(UserContext)
  const canSearchForProperty =
    user &&
    (user.hasAgentPermissions ||
      user.hasContractManagerPermissions ||
      user.hasAuthorisationManagerPermissions)
  const [searchQuery, setSearchQuery] = useState('')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const router = useRouter()
  const workOrderReferenceRegex = /^[0-9]{7,10}$/g

  const searchHeadingText = canSearchForProperty
    ? 'Find repair job or property'
    : 'Find repair job'
  const searchLabelText = canSearchForProperty
    ? 'Search by work order reference, postcode or address'
    : 'Search by work order reference'

  useEffect(() => {
    if (query) {
      if (workOrderReferenceRegex.test(query) || !canSearchForProperty) {
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

    if (workOrderReferenceRegex.test(searchQuery) || !canSearchForProperty) {
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
    <>
      <Meta title="Search" />
      <div>
        <section className="section">
          <h1 className="lbh-heading-h1">{searchHeadingText}</h1>

          <div className="govuk-form-group lbh-form-group">
            <form>
              <label className="govuk-label lbh-label">{searchLabelText}</label>
              <input
                className="govuk-input lbh-input govuk-input--width-10"
                id="input-search"
                name="search-name"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
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
    </>
  )
}

export default Search
