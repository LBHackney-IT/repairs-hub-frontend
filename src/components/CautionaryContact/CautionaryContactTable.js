import PropTypes from 'prop-types'
import { Table, THead, TBody, TR, TH, TD } from '../Layout/Table'

const CautionaryContactTable = ({ cautionaryContacts, query }) => {
  return (
    <>
      <Table>
        <THead>
          <TR className="lbh-body">
            <TH scope="col">Code</TH>
            <TH scope="col">Description</TH>
          </TR>
        </THead>
        <TBody>
          {cautionaryContacts.map((cautionaryContact, index) => (
            <TR key={index} index={index}>
              {query && query.includes(cautionaryContact.code) ? (
                <>
                  <TD className="text-dark-red lbh-!-font-weight-bold">
                    {cautionaryContact.code}
                  </TD>
                  <TD className="text-dark-red lbh-!-font-weight-bold">
                    {cautionaryContact.description}
                  </TD>
                </>
              ) : (
                <>
                  <TD>{cautionaryContact.code}</TD>
                  <TD>{cautionaryContact.description}</TD>
                </>
              )}
            </TR>
          ))}
        </TBody>
      </Table>
    </>
  )
}

CautionaryContactTable.propTypes = {
  cautionaryContacts: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  query: PropTypes.array,
}

export default CautionaryContactTable
