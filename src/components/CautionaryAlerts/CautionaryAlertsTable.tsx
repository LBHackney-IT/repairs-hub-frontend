import { Table, THead, TBody, TR, TH, TD } from '../Layout/Table'

interface Props {
  cautionaryAlerts: { code: string; description: string }[]
  query?: string[]
}

const CautionaryAlertsTable = ({ cautionaryAlerts, query }: Props) => {
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
            <TR key={index} index={index}>
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

export default CautionaryAlertsTable
