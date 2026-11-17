import { TR, TD } from '../../Layout/Table'

interface Props {
  contact: {
    fullName?: string
    phoneNumbers: { value?: string }[]
  }
}

const Row = ({ contact }: Props) => {
  return (
    <TR>
      <TD>{contact?.fullName}</TD>
      <TD>{contact.phoneNumbers[0]?.value}</TD>
      <TD>{contact.phoneNumbers[1]?.value}</TD>
      <TD>{contact.phoneNumbers[2]?.value}</TD>
    </TR>
  )
}

export default Row
