import WarningInfoBox from '../../../Template/WarningInfoBox'
import { JSX } from 'react'

export const NoContractsFoundMessage = ({
  warningText,
}: {
  warningText: string | JSX.Element
}) => {
  return (
    <div style={{ width: '90%' }}>
      <WarningInfoBox
        header="No contracts found!"
        text={warningText}
        name="no-contracts-found"
      />
    </div>
  )
}
