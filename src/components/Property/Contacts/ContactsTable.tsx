import ContactsRow, { Contact } from './ContactsRow'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'

interface Props {
  contacts: Contact[]
}

const ContactsTable = ({ contacts }: Props) => {
  if (!contacts.length) {
    return (
      <p className="govuk-body-s" style={{ marginTop: '15px' }}>
        No household members
      </p>
    )
  }

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

export default ContactsTable
