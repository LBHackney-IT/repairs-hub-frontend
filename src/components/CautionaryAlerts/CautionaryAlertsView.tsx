import BackButton from '../Layout/BackButton'
import CautionaryAlertsTable from './CautionaryAlertsTable'
import { CAUTIONARY_ALERTS } from '@/utils/cautionaryAlerts'

interface Props {
  query?: { cautContactCodes?: string[] }
}

const CautionaryAlertsView = (searchQuery: Props) => {
  const queryParams = searchQuery?.query?.cautContactCodes || []

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
