import Contract from '@/root/src/models/contract'
import { dateDiffRoundedUp } from './ContractExpiryDisplay'
import { dateToStr } from '@/root/src/utils/date'
import { ContractListItem } from './ContractListItem'

interface Props {
  contract: Contract
  index: number
}

export const DashboardContractListItem = (props: Props) => {
  const { contract } = props

  return (
    <div style={{
       border: '2px solid #eee',
       padding: "10px",
       marginTop: 0,
       borderRadius: "5px"
      //  display: "flex",
      //  alignItems: "center"
    }}>
      <h5
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        {contract.contractorName}
      </h5>

      <div style={{display: "flex"}}>


      <p style={{marginTop: 0, marginLeft: "10px"}}>{contract.contractReference}</p>
      <p style={{marginTop: 0, marginLeft: "10px"}}>Manager: <a href={`mailto:callum.macpherson@hackney.gov.uk`}>callum.macpherson@hackney.gov.uk</a></p>

      {contract.terminationDate < new Date().toISOString() ? (
        <p style={{marginTop: 0, marginLeft: "10px"}}>
          Expired:{' '}
          <span style={{ fontWeight: '600' }}>
            {dateDiffRoundedUp(contract)} days ago
          </span>
        </p>
      ) : (
        <p style={{marginTop: 0, marginLeft: "10px"}}>
          Expires:{' '}
          <span style={{ fontWeight: '600' }}>
            {dateToStr(contract.terminationDate)}
          </span>
        </p>
      )}
      </div>
    </div>
  )
}
