import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropertiesTable from '../Properties/PropertiesTable'
import { Button } from '../Form'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { getProperties } from '../../utils/frontend-api-client/properties'

const Search = ({ query }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const router = useRouter()

  useEffect(() => {
    if (query) {
      setSearchQuery(decodeURI(query.q))
      searchForProperties(query.q)
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
      console.log('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    propertiesURL(searchQuery)
    searchQuery && searchForProperties(searchQuery)
  }

  const propertiesURL = (searchQuery) => {
    router.push({
      pathname: '/properties/search',
      query: {
        q: encodeURI(searchQuery),
      },
    })
  }

  return (
    <div>
      <section className="section">
        <h1 className="govuk-heading-m">Find property</h1>

        <div className="govuk-form-group">
          <form>
            <label className="govuk-label">
              <p className="govuk-body-s govuk-!-margin-bottom-0">
                Search by postcode or address
              </p>
              <input
                type="text"
                className="govuk-input govuk-input--width-10 focus-colour govuk-!-margin-bottom-5"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <Button type="submit" label="Search" onClick={handleSubmit} />
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
