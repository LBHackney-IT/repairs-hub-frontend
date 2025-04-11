import PropTypes from 'prop-types'
import { Table, THead, TBody, TR, TH, TD } from '../Layout/Table'

const CautionaryAlertsTable = ({ cautionaryAlerts, query }) => {
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
          {cautionaryAlerts.map((cautionaryAlert, index) => (
            <TR
              key={index}
              index={index}
            >
              {query && query.includes(cautionaryAlert.code) ? (
                <>
                  <TD className="text-dark-red lbh-!-font-weight-bold">
                    {cautionaryAlert.code}
                  </TD>
                  <TD className="text-dark-red lbh-!-font-weight-bold">
                    {cautionaryAlert.description}
                  </TD>
                </>
              ) : (
                <>
                  <TD>{cautionaryAlert.code}</TD>
                  <TD>{cautionaryAlert.description}</TD>
                </>
              )}
            </TR>
          ))}
        </TBody>
      </Table>
    </>
  )
}

CautionaryAlertsTable.propTypes = {
  cautionaryAlerts: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  query: PropTypes.array,
}

export default CautionaryAlertsTable
