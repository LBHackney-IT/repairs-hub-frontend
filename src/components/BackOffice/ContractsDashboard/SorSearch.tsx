import Meta from '../../Meta'

import Contract from '@/root/src/models/contract'

import ContractListItems from './Contract/ContractListItems'

import { PrimarySubmitButton } from '../../Form'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'

interface SorSearchProps {
  searchHeadingText: string
  searchLabelText: string
  sorCode: string
  setSorCode: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  contracts: Contract[]
  isLoading: boolean
  error: Error | null
  contractorName: string
}

const SorSearch = ({
  searchHeadingText,
  searchLabelText,
  sorCode,
  setSorCode,
  handleSubmit,
  contracts,
  isLoading,
  error,
  contractorName,
}: SorSearchProps) => {
  return (
    <>
      <Meta title="SorSearch" />
      <div>
        <section className="section">
          <h3 className="lbh-heading-h3">{searchHeadingText}</h3>

          <div className="govuk-form-group lbh-form-group">
            <form onSubmit={handleSubmit}>
              <label htmlFor={'input-search'} className="govuk-label lbh-label">
                {searchLabelText}
              </label>
              <input
                className="govuk-input lbh-input govuk-input--width-10"
                id="input-search"
                data-testid="input-search"
                name="search-name"
                type="text"
                value={sorCode}
                onChange={(event) => setSorCode(event.target.value)}
              />
              <PrimarySubmitButton
                id="submit-search"
                label="Search"
                disabled={!sorCode?.trim() || sorCode.trim().length < 0}
                onClick={handleSubmit}
              />
            </form>
          </div>
        </section>

        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {contracts?.length > 0 && (
              <ContractListItems
                contracts={contracts}
                heading={`${sorCode} found in the following ${contractorName} contracts`}
                page="sorSearch"
              />
            )}
            {contracts?.length === 0 && (
              <p className="lbh-body">
                No contracts with{' '}
                <span style={{ fontWeight: 600 }}>{sorCode}</span> SOR code{' '}
              </p>
            )}
            {error && (
              <ErrorMessage
                label={
                  error instanceof Error
                    ? error.message
                    : typeof error === 'string'
                    ? error
                    : 'An unexpected error occurred'
                }
              />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default SorSearch
