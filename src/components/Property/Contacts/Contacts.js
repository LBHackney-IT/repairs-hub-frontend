import PropTypes from 'prop-types'
import WarningText from '../../Template/WarningText'
import ContactsTable from './ContactsTable'

const warningText = (contacts) => {
  if (contacts.length < 1) {
    return 'No contact details available for this property'
  } else if (contacts[0] === 'REMOVED') {
    return 'You are not permitted to view contact details'
  }
}

const Contacts = ({ contacts }) => {
  const text = warningText(contacts)

  return text ? (
    <WarningText text={text} />
  ) : (
    <ContactsTable contacts={contacts} />
  )
}

Contacts.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Contacts
