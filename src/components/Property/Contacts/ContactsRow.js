import PropTypes from 'prop-types'
import { TR, TD } from '../../Layout/Table'

const Row = ({ contact }) => {
  return (
    <TR>
      <TD>{[contact?.fullName]}</TD>
      <TD>{contact.phoneNumbers[0]?.value}</TD>
      <TD>{contact.phoneNumbers[1]?.value}</TD>
      <TD>{contact.phoneNumbers[2]?.value}</TD>
    </TR>
  )
}

Row.propTypes = {
  contact: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumbers: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
}

export default Row
