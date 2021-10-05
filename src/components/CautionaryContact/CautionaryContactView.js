import BackButton from '../Layout/BackButton'
import CautionaryContactTable from './CautionaryContactTable'
import { CAUTIONARY_ALERTS } from '../../utils/cautContactAlerts'

const CautionaryContactView = (searchQuery) => {
  const queryParams = searchQuery?.query?.cautContactCodes || []

  return (
    <>
      <BackButton />
      <h3 className="lbh-heading-h3">Cautionary contact</h3>
      <CautionaryContactTable
        cautionaryContacts={CAUTIONARY_ALERTS}
        query={queryParams}
      />
    </>
  )
}

export default CautionaryContactView
