import PropTypes from 'prop-types'
import ContactsRow from './ContactsRow'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'

const ContactsTable = ({ contacts }) => {
  return (
    <Table>
      <THead>
        <TR>
          <TH scope="col">Name</TH>
          <TH scope="col">Telephone 1</TH>
          <TH scope="col">Telephone 2</TH>
          <TH scope="col">Telephone 3</TH>
        </TR>
      </THead>
      <TBody>
        {contacts.map((contact, index) => (
          <ContactsRow key={index} contact={contact} />
        ))}
      </TBody>
    </Table>
  )
}

ContactsTable.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default ContactsTable
