import BackButton from '../Layout/BackButton'
import CautionaryContactTable from './CautionaryContactTable'
import { CAUTIONARY_CONTACT } from '../../utils/cautContactAlertsDescription'

const CautionaryContactView = (searchQuery) => {
  const cautionaryContacts = CAUTIONARY_CONTACT

  return (
    <>
      <BackButton />
      <h3 className="lbh-heading-h3">Cautionary contact</h3>
      <CautionaryContactTable
        cautionaryContacts={cautionaryContacts}
        query={
          searchQuery && searchQuery.query && searchQuery.query.cautContactCodes
            ? searchQuery.query.cautContactCodes
            : false
        }
      />
    </>
  )
}

export default CautionaryContactView
