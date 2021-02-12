import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropertiesTable from '../Properties/PropertiesTable'
import { Button } from '../Form'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { getProperties } from '../../utils/frontend-api-client/properties'

const Search = ({ query }) => {
  const [searchParams, setSearchParams] = useState('')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState()
  const router = useRouter()

  useEffect(() => {
    if (query) {
      setSearchParams(decodeURI(query.q))
      searchForProperties(query.q)
    }
  }, [])

  async function searchForProperties(newSearchQuery) {
    setLoading(true)
    setSearchQuery(newSearchQuery)
    setError(null)

    try {
      const data = await getProperties(newSearchQuery)
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

    setSearchQuery(searchParams)

    updateSearchQuery(searchParams)
    query && searchForProperties(searchParams)
  }

  const updateSearchQuery = (newSearchQuery) => {
    router.push({
      pathname: '/properties/search',
      query: {
        q: encodeURI(newSearchQuery),
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
                value={searchParams}
                onChange={(event) => setSearchParams(event.target.value)}
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
