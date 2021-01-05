import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import PropertiesTable from '../Properties/PropertiesTable'
import Button from '../Form/Button/Button'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import ApiRequestsCacher from '../../utils/api/repairs/ApiRequestsCacher'

const Search = ({ query }) => {
  const [searchParams, setSearchParams] = useState('')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState()
  const router = useRouter()
  const apiRequester = useMemo(() => {
    return new ApiRequestsCacher()
  }, [])

  useEffect(() => {
    if (query) {
      setSearchParams(decodeURI(query.q))
      searchForProperties(query.q)
    }
  }, [])

  async function searchForProperties(newSearchQuery) {
    setSearching(true)
    setLoading(true)
    setSearchQuery(newSearchQuery)
    setError(null)

    try {
      const data = await apiRequester.getProperties(newSearchQuery)
      setProperties(data)
    } catch (e) {
      setProperties(null)
      console.log('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setSearching(false)
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

  const renderSearchResults = () => {
    if (properties?.length > 0) {
      return <PropertiesTable properties={properties} query={searchQuery} />
    }

    if (!error) {
      return (
        <>
          <div>
            <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />
            <p className="govuk-heading-s">
              We found 0 matching results for: {decodeURI(searchQuery)}
            </p>
          </div>
        </>
      )
    }
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
          {!searching && renderSearchResults()}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </div>
  )
}

export default Search
