import PropTypes from 'prop-types'
import WarningText from '../../WarningText'
import ContactsTable from './ContactsTable'

const Contacts = ({ contacts }) => {
  return contacts.length < 1 ? (
    <WarningText text="No contact details available for this property" />
  ) : (
    <ContactsTable contacts={contacts} />
  )
}

Contacts.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Contacts
