import BackButton from '../Layout/BackButton'
import CautionaryContactTable from './CautionaryContactTable'
import { CAUTIONARY_CONTACT } from '../../utils/cautContactAlertsDescription'

const CautionaryContactView = (searchQuery) => {
  const cautionaryContacts = CAUTIONARY_CONTACT
  const queryParams = searchQuery?.query?.cautContactCodes || []

  return (
    <>
      <BackButton />
      <h3 className="lbh-heading-h3">Cautionary contact</h3>
      <CautionaryContactTable
        cautionaryContacts={cautionaryContacts}
        query={queryParams}
      />
    </>
  )
}

export default CautionaryContactView
