import BackButton from '../Layout/BackButton'
import CautionaryAlertsTable from './CautionaryAlertsTable'
import { CAUTIONARY_ALERTS } from '@/utils/cautionaryAlerts'

interface Props {
  query?: {
    cautContactCodes?: string | string[]
  }
}

const CautionaryAlertsView = ({ query }: Props) => {
  const queryParams = query?.cautContactCodes || []

  return (
    <>
      <BackButton />
      <h3 className="lbh-heading-h3">Cautionary alerts</h3>
      <CautionaryAlertsTable
        cautionaryAlerts={CAUTIONARY_ALERTS}
        query={queryParams}
      />
    </>
  )
}

export default CautionaryAlertsView
