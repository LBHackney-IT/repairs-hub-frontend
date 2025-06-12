import ContractListItem from './ContractListItem'
import { Button } from '../../Form'

export const ContractsListItems = ({
  filteredContracts,
  setPageNumber,
  pageNumber,
  totalPages,
}) => {
  if (filteredContracts === null || filteredContracts?.length === 0) {
    return <></>
  }

  return (
    <div>
      {filteredContracts.map((contract, index) => (
        <ContractListItem
          index={index}
          contract={contract}
          key={contract.contractReference}
        />
      ))}
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
