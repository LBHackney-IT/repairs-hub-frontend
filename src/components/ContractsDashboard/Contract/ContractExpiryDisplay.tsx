import Contract from '@/root/src/models/contract'
import { dateToStr } from '@/root/src/utils/date'

interface ContractExpiryDisplayProps {
  contract: Contract
  page: string
}
const ContractExpiryDisplay = ({
  contract,
  page,
}: ContractExpiryDisplayProps) => {
  const dateDiffRoundedUp = () => {
    const todayTimestamp = new Date().getTime()

    const contractTerminationTimeStamp = new Date(
      contract.terminationDate
    ).getTime()
    const diffTime = Math.abs(todayTimestamp - contractTerminationTimeStamp)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <>
      {page === 'contractor' && (
        <p>
          {contract.terminationDate < new Date().toISOString()
            ? `Expired: `
            : `Expires: `}
          <span style={{ fontWeight: '600' }}>
            {dateToStr(contract.terminationDate)}
          </span>
        </p>
      )}

      {page === 'dashboard' &&
        (contract.terminationDate < new Date().toISOString() ? (
          <p>
            Expired:{' '}
            <span style={{ fontWeight: '600' }}>
              {dateDiffRoundedUp()} days ago
            </span>
          </p>
        ) : (
          <p>
            Expires:{' '}
            <span style={{ fontWeight: '600' }}>
              {dateToStr(contract.terminationDate)}
            </span>
          </p>
        ))}

      {page === 'sorSearch' && (
        <>
          {contract.terminationDate < new Date().toISOString() ? (
            <p style={{ color: 'red' }}>
              Expired: {dateToStr(contract.terminationDate)}
            </p>
          ) : (
            <p style={{ color: 'green' }}>Active</p>
          )}
        </>
      )}
    </>
  )
}

export default ContractExpiryDisplay
