import { PrimarySubmitButton } from '../Form'
import SearchResults from './SearchResults'
import Meta from '../Meta'
import useSearch from './useSearch'

interface SearchProps {
  query?: {
    searchText?: string
  }
}

const Search: React.FC<SearchProps> = ({ query }) => {
  const {
    userCanSearchForProperty,
    searchTextInput,
    setSearchTextInput,
    handleSubmit,
    urlSearchText,
    properties,
    searchHitTotal,
    loading,
    error,
  } = useSearch(query)

  const searchHeadingText = userCanSearchForProperty
    ? 'Find repair work order or property'
    : 'Find repair work order'
  const searchLabelText = userCanSearchForProperty
    ? 'Search by work order reference, postcode or address'
    : 'Search by work order reference'

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

        <SearchResults
          loading={loading}
          properties={properties}
          searchHitTotal={searchHitTotal}
          searchText={urlSearchText}
          error={error}
        />
      </div>
    </>
  )
}

export default Search
