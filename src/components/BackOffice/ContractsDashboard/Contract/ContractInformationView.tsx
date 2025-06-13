import { dateToStr } from '@/root/src/utils/date'
import Contract from '@/root/src/models/contract'

interface ContractInformationViewProps {
  contract: Contract
}

const ContractInformationView = ({
  contract,
}: ContractInformationViewProps) => {
  return (
    <>
      <p>{`Contractor reference: ${contract.contractorReference}`}</p>
      <p>{`Expiration date: ${dateToStr(contract.terminationDate)}`}</p>
      <p>{`Start date: ${dateToStr(contract.effectiveDate)}`}</p>
      <p>{`Is raisable: ${contract.isRaisable.toString()}`}</p>
    </>
  )
}

export default ContractInformationView
