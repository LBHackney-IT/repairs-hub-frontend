import Contractor from '@/root/src/models/contractor'
import ContractorListItem from './ContractorListItem'
import WarningInfoBox from '../../../Template/WarningInfoBox'

interface ContractorsListItemsProps {
  contractors: Contractor[]
}

const ContractorsListItems = ({ contractors }: ContractorsListItemsProps) => {
  if (contractors.length === 0) {
    return (
      <>
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
      <ol
        className="lbh-list mobile-working-work-order-list"
        data-test-id="contractors-list"
      >
        {contractors.map((obj, index) => (
          <ContractorListItem
            contractorReference={obj.contractorReference}
            contractorName={obj.contractorName}
            activeContractCount={obj.activeContractCount}
            key={index}
          />
        ))}
      </ol>
    </div>
  )
}

export default ContractorsListItems
