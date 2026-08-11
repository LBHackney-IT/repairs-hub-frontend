import Contractor from '@/root/src/models/contractor'
import ContractorListItem from './ContractorListItem'
import ContractDashboardContractor from '@/root/src/models/contractDashboardContractor'
import { TextInput } from '../../Form'
import { useState } from 'react'

interface Props {
  contractors: ContractDashboardContractor[]
}

const ContractorsListItems = ({ contractors }: Props) => {
  const [searchValue, setSearchValue] = useState<string>()

  const filterSearchResults = (
    searchValue: string = '',
    contractors: ContractDashboardContractor[]
  ) => {
    const cleanedValue = searchValue.toLowerCase().trim()

    return contractors.filter((x) => {
      if (x.contractorName.toLowerCase().includes(cleanedValue)) return true
      if (x.contractorReference.toLowerCase().includes(cleanedValue))
        return true

      return false
    })
  }

  const handleClear = () => {
    setSearchValue(() => '')
  }

  const filteredResults = filterSearchResults(searchValue, contractors)
  const clearButtonIsDisabled = searchValue === ''

  return (
    <div>
      <TextInput
        label="Filter by contractor name"
        placeholder="eg. H01 or Hackney General Building.."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <button
        className="lbh-link lbh-body-xs"
        style={{
          marginTop: 5,
          color: clearButtonIsDisabled ? 'grey' : 'inherit',
        }}
        onClick={handleClear}
        disabled={clearButtonIsDisabled}
        aria-disabled={clearButtonIsDisabled}
      >
        Clear
      </button>

      <ol
        className="lbh-list mobile-working-work-order-list"
        data-test-id="contractors-list"
      >
        {filteredResults.map((contractor, index) => (
          <ContractorListItem contractor={contractor} key={index} />
        ))}
      </ol>
    </div>
  )
}

export default ContractorsListItems
