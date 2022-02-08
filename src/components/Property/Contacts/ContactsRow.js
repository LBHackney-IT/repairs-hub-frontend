import PropTypes from 'prop-types'
import { TR, TD } from '../../Layout/Table'

const Row = ({ contact }) => {
  return (
    <TR>
      <TD>{[contact?.firstName, contact?.lastName].join(' ')}</TD>
      <TD>{contact.phoneNumbers[0]}</TD>
      <TD>{contact.phoneNumbers[1]}</TD>
      <TD>{contact.phoneNumbers[2]}</TD>
    </TR>
  )
}

Row.propTypes = {
  contact: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumbers: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
}

export default Row
