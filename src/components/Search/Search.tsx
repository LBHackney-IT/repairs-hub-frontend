import { useState, useEffect, useContext, FormEvent } from 'react'
import { useRouter } from 'next/router'
import UserContext from '../UserContext'
import PropertiesTable from '../Properties/PropertiesTable'
import { PrimarySubmitButton } from '../Form'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Meta from '../Meta'
import { canSearchForProperty } from '@/utils/userPermissions'
import { PropertyListItem } from '@/models/propertyListItem'
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'

interface SearchProps {
  query?: {
    searchText?: string
    pageNumber?: string
  }
}

interface PropertyData {
  total: string
  properties: PropertyListItem[]
}

const Search: React.FC<SearchProps> = ({ query }) => {
  const { NEXT_PUBLIC_PROPERTIES_PAGE_SIZE } = process.env

  const decodedQueryParamSearchText = query?.searchText
    ? decodeURIComponent(query.searchText.replace(/\+/g, ' '))
    : ''

  const pageNumber = query?.pageNumber

  const { user } = useContext(UserContext)
  const router = useRouter()

  const userCanSearchForProperty = user && canSearchForProperty(user)

  const [searchTextInput, setSearchTextInput] = useState<string>('')
  const [properties, setProperties] = useState<PropertyListItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchHitTotal, setSearchHitTotal] = useState<number | null>(null)

  const WORK_ORDER_REFERENCE_REGEX = /^[0-9]{7,10}$/g

  const searchHeadingText = userCanSearchForProperty
    ? 'Find repair work order or property'
    : 'Find repair work order'
  const searchLabelText = userCanSearchForProperty
    ? 'Search by work order reference, postcode or address'
    : 'Search by work order reference'

  useEffect(() => {
    if (decodedQueryParamSearchText) {
      if (
        WORK_ORDER_REFERENCE_REGEX.test(decodedQueryParamSearchText) ||
        !userCanSearchForProperty
      ) {
        workOrderUrl(decodedQueryParamSearchText)
      } else {
        setSearchTextInput(decodedQueryParamSearchText)
        searchForProperties(decodedQueryParamSearchText, pageNumber)
      }
    }
  }, [])

  useEffect(() => {
    if (pageNumber && searchTextInput) {
      searchForProperties(searchTextInput, pageNumber)
    }
  }, [pageNumber])

  const searchForProperties = async (searchQuery, pageNumber) => {
    if (!searchQuery.trim() || searchQuery.trim().length <= 1) return
    setLoading(true)
    setError(null)

    try {
      if (searchQuery) {
        const propertiesData: PropertyData = await frontEndApiRequest({
          method: 'get',
          path: '/api/properties/search',
          params: {
            searchText: searchQuery,
            ...(searchQuery && { pageSize: NEXT_PUBLIC_PROPERTIES_PAGE_SIZE }),
            ...(pageNumber && { pageNumber: parseInt(pageNumber) }),
          },
        })

        setSearchHitTotal(parseInt(propertiesData.total))

        setProperties(
          propertiesData.properties.map(
            (property) => new PropertyListItem(property)
          )
        )
      } else {
        setSearchHitTotal(0)
        setProperties([])
      }
    } catch (e) {
      setProperties(null)
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (
      WORK_ORDER_REFERENCE_REGEX.test(searchTextInput) ||
      !userCanSearchForProperty
    ) {
      workOrderUrl(searchTextInput)
    } else {
      router.push({
        pathname: '/search',
        query: {
          searchText: searchTextInput,
        },
      })
      searchForProperties(searchTextInput, 1)
    }
  }

  const workOrderUrl = (reference: string) => {
    router.push(`/work-orders/${reference}`)
  }

  return (
    <>
      <Meta title="Search" />
      <div>
        <section className="section">
          <h1 className="lbh-heading-h1">{searchHeadingText}</h1>

          <div className="govuk-form-group lbh-form-group">
            <form>
              <label htmlFor={'input-search'} className="govuk-label lbh-label">
                {searchLabelText}
              </label>
              <input
                className="govuk-input lbh-input govuk-input--width-10"
                id="input-search"
                data-testid="input-search"
                name="search-name"
                type="text"
                value={searchTextInput}
                onChange={(event) => setSearchTextInput(event.target.value)}
              />
              <PrimarySubmitButton
                id="submit-search"
                label="Search"
                disabled={
                  !searchTextInput.trim() || searchTextInput.trim().length <= 1
                }
                onClick={handleSubmit}
              />
            </form>
          </div>
        </section>

        {loading ? (
          <Spinner />
        ) : (
          <>
            {properties?.length > 0 && (
              <>
                <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />
                <h3 className="lbh-heading-h3">
                  {`We found ${
                    properties.length
                  } matching results for: ${decodeURI(
                    decodedQueryParamSearchText
                  )}`}
                </h3>

                <PropertiesTable properties={properties} />
              </>
            )}

            {searchHitTotal === 0 && (
              <p className="lbh-body">No results found</p>
            )}

            {error && <ErrorMessage label={error} />}
          </>
        )}
      </div>
    </>
  )
}

export default Search
