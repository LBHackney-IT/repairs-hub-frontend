import PropTypes from 'prop-types'
import ContactsNoneAvailable from './ContactsNoneAvailable'
import ContactsTable from './ContactsTable'

const Contacts = ({ contacts }) => {
  return contacts.length < 1 ? (
    <ContactsNoneAvailable />
  ) : (
    <ContactsTable contacts={contacts} />
  )
}

Contacts.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Contacts
