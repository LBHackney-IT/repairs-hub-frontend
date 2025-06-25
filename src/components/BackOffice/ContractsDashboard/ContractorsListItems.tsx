import ContractorListItem from './ContractorListItem'
import { Button } from '../../Form'

import Contract from '@/root/src/models/contract'

interface ContractorsListItemsProps {
  contracts: Contract[]
  setPageNumber: (pageNumber: number) => void
  isLoading?: boolean
  pageNumber: number
  totalPages: number
}

const ContractorsListItems = ({
  contracts,
  setPageNumber,
  pageNumber,
  totalPages,
}: ContractorsListItemsProps) => {
  const contractsThatExpireAfterOrInTwentyTwenty = contracts
    ?.filter((c) => c.terminationDate > '2020')
    .reduce((acc, contract) => {
      const key = contract.contractorName
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(contract)
      return acc
    }, [])

  if (
    !contractsThatExpireAfterOrInTwentyTwenty ||
    Object.keys(contractsThatExpireAfterOrInTwentyTwenty).length === 0
  ) {
    return (
      <>
        <h1>Contracts didn't load</h1>
      </>
    )
  }

  const contractors = Object.keys(
    contractsThatExpireAfterOrInTwentyTwenty
  ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

  const sortedContracts = Object.values(
    contractsThatExpireAfterOrInTwentyTwenty
  ).sort((a, b) =>
    a[0].contractorName.localeCompare(b[0].contractorName, undefined, {
      sensitivity: 'base',
    })
  )

  return (
    <div>
      <ol className="lbh-list mobile-working-work-order-list">
        {contractors.map((contractorName) => (
          <ContractorListItem
            contractorName={contractorName}
            sortedContracts={sortedContracts.filter(
              (contracts) => contracts[0].contractorName === contractorName
            )}
            // key={contract.contractReference}
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
