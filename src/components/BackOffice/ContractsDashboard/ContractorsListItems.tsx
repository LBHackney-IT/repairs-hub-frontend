import Contract from '@/root/src/models/contract'
import ContractorListItem from './ContractorListItem'
import WarningInfoBox from '../../Template/WarningInfoBox'

interface ContractorsListItemsProps {
  contracts: Contract[]
}

const ContractorsListItems = ({ contracts }: ContractorsListItemsProps) => {
  const relevantContracts = contracts?.filter((c) => c.terminationDate > '2020')

  const contractorNames = new Set<string>(
    relevantContracts.map((contract) => contract.contractorName)
  )
  const contractorReferences = new Set<string>(
    relevantContracts.map((contract) => contract.contractorReference)
  )

  const contractorNamesAndReferences = [...contractorNames].map(
    (name, index) => ({
      contractorName: name,
      contractorReference: [...contractorReferences][index],
    })
  )

  const contractorNamesAndReferencesSortedByContractorName = contractorNamesAndReferences.sort(
    (a, b) => a.contractorName.localeCompare(b.contractorName)
  )

  if (
    !contractorNamesAndReferencesSortedByContractorName ||
    Object.keys(contractorNamesAndReferencesSortedByContractorName).length === 0
  ) {
    return (
      <>
        <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
          Contractors:
        </h3>
        <div style={{ width: '85%' }}>
          <WarningInfoBox
            header="No contractors found!"
            text="Problem loading contractors."
            name="no-contractors-found"
          />
        </div>
      </>
    )
  }

  return (
    <div>
      <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
        Contractors:
      </h3>
      <ol className="lbh-list mobile-working-work-order-list">
        {contractorNamesAndReferencesSortedByContractorName.map(
          (obj, index) => (
            <ContractorListItem
              contractorReference={obj.contractorReference}
              contractorName={obj.contractorName}
              key={index}
            />
          )
        )}
      </ol>
    </div>
  )
}

export default ContractorsListItems
