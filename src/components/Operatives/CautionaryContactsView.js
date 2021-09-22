import BackButton from '../Layout/BackButton'
import { Table, THead, TBody, TR, TH, TD } from '../Layout/Table'
import { CAUTIONARY_CONTACT } from '../../utils/cautContactAlertsDescription'
const CautionaryContactView = () => (
  <>
    <BackButton />
    <h3 className="lbh-heading-h3">Cautionary contact</h3>
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
            <TD>{entry.code}</TD>
            <TD>{entry.description}</TD>
          </TR>
        ))}
      </TBody>
    </Table>
  </>
)

export default CautionaryContactView
