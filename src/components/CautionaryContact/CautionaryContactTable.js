import { Table, THead, TBody, TR, TH, TD } from '../Layout/Table'
import { CAUTIONARY_CONTACT } from '../../utils/cautContactAlertsDescription'
const CautionaryContactTable = (codes) => {
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
          {CAUTIONARY_CONTACT.map((entry, index) => (
            <TR key={index} index={index}>
              {codes && codes.codes.includes(entry.code) ? (
                <>
                  <TD className="highlight-for-existing-code">{entry.code}</TD>
                  <TD className="highlight-for-existing-code">
                    {entry.description}
                  </TD>
                </>
              ) : (
                <>
                  <TD>{entry.code}</TD>
                  <TD>{entry.description}</TD>
                </>
              )}
            </TR>
          ))}
        </TBody>
      </Table>
    </>
  )
}

export default CautionaryContactTable
