import ContractorListItem from './ContractorListItem'
import { Button } from '../../Form'

import Contract from '@/root/src/models/contract'

interface ContractorsListItemsProps {
  filteredContracts: Contract[]
  setPageNumber: (pageNumber: number) => void
  pageNumber: number
  totalPages: number
}

const ContractorsListItems = ({
  filteredContracts,
  setPageNumber,
  pageNumber,
  totalPages,
}: ContractorsListItemsProps) => {
  if (filteredContracts === null || filteredContracts?.length === 0) {
    return <></>
  }

  return (
    <div>
      <ol className="lbh-list mobile-working-work-order-list">
        {filteredContracts.map((contract) => (
          <ContractorListItem
            contractorReference={contract.contractorReference}
            key={contract.contractReference}
          />
        ))}
      </ol>
      <div className="page-navigation govuk-!-padding-bottom-5">
        {pageNumber > 1 && (
          <Button
            label="Previous page"
            onClick={() => setPageNumber(pageNumber - 1)}
            type="submit"
          />
        )}
        {pageNumber < totalPages && (
          <Button
            label="Next page"
            onClick={() => setPageNumber(pageNumber + 1)}
            type="submit"
            className="right-page-button"
          />
        )}
      </div>
    </div>
  )
}

export default ContractorsListItems
