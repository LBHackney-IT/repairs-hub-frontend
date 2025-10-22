import Contractor from '@/root/src/models/contractor'
import ContractorListItem from './ContractorListItem'

interface ContractorsListItemsProps {
  contractors: Contractor[]
}

const ContractorsListItems = ({ contractors }: ContractorsListItemsProps) => {
  return (
    <div>
      <ol
        className="lbh-list mobile-working-work-order-list"
        data-test-id="contractors-list"
      >
        {contractors.map((contractor, index) => (
          <ContractorListItem
            contractorReference={contractor.contractorReference}
            contractorName={contractor.contractorName}
            activeContractCount={contractor.activeContractCount}
            key={index}
          />
        ))}
      </ol>
    </div>
  )
}

export default ContractorsListItems
