import Meta from '../Meta'

import Contract from '@/root/src/models/contract'

import { PrimarySubmitButton } from '../Form'
import ContractSection from './Contract/ContractSection'

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
                data-testid="submit-search"
                label="Search"
                disabled={!sorCode?.trim() || sorCode.trim().length < 0}
                onClick={handleSubmit}
              />
            </form>
          </div>
        </section>

        <ContractSection
          subHeading={`${sorCode} found in the following ${contractorName} contracts`}
          contracts={contracts}
          isLoading={isLoading}
          warningText={
            <p className="lbh-body">
              No contracts with{' '}
              <span style={{ fontWeight: 600 }}>{sorCode}</span> SOR code
            </p>
          }
          error={error}
          page="sorSearch"
        />
      </div>
    </>
  )
}

export default SorSearch
