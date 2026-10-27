import PropertiesTable from '../Properties/PropertiesTable'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { PropertyListItem } from '@/models/propertyListItem'

interface SearchResultsProps {
  loading: boolean
  properties: PropertyListItem[] | null
  searchHitTotal: number | null
  searchText: string
  error: string | null
}

const SearchResults: React.FC<SearchResultsProps> = ({
  loading,
  properties,
  searchHitTotal,
  searchText,
  error,
}) => {
  if (loading) return <Spinner />

  return (
    <>
      {properties?.length > 0 && (
        <>
          <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />
          <h3 className="lbh-heading-h3">
            {`We found ${properties.length} matching results for: ${decodeURI(
              searchText
            )}`}
          </h3>

          <PropertiesTable properties={properties} />
        </>
      )}

      {searchHitTotal === 0 && <p className="lbh-body">No results found</p>}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default SearchResults
