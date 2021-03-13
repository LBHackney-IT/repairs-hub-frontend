import PropTypes from 'prop-types'

const Row = ({ contact }) => {
  return (
    <tr className="govuk-table__row">
      <td className="govuk-table__cell">
        {[contact?.firstName, contact?.lastName].join(' ')}
      </td>
      <td className="govuk-table__cell">{contact.phoneNumbers[0]}</td>
      <td className="govuk-table__cell">{contact.phoneNumbers[1]}</td>
      <td className="govuk-table__cell">{contact.phoneNumbers[2]}</td>
    </tr>
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
