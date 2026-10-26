import { TR, TD } from '../../Layout/Table'

export interface Contact {
  fullName?: string
  phoneNumbers: { value: string }[]
}

interface Props {
  contact: Contact
}

const Row = ({ contact }: Props) => {
  return (
    <TR>
      <TD>{[contact?.fullName]}</TD>
      <TD>{contact.phoneNumbers[0]?.value}</TD>
      <TD>{contact.phoneNumbers[1]?.value}</TD>
      <TD>{contact.phoneNumbers[2]?.value}</TD>
    </TR>
  )
}

export default Row
