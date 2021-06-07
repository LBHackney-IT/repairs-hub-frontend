import PropTypes from 'prop-types'
import ContactsRow from './ContactsRow'

const ContactsTable = ({ contacts }) => {
  return (
    <table className="govuk-table lbh-table">
      <caption className="govuk-table__caption">Contacts</caption>
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th className="govuk-table__header" scope="col">
            Name
          </th>
          <th className="govuk-table__header" scope="col">
            Telephone 1
          </th>
          <th className="govuk-table__header" scope="col">
            Telephone 2
          </th>
          <th className="govuk-table__header" scope="col">
            Telephone 3
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {contacts.map((contact, index) => (
          <ContactsRow key={index} contact={contact} />
        ))}
      </tbody>
    </table>
  )
}

ContactsTable.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default ContactsTable
