import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'
import { Table, TBody, TR, TH, TD } from '../Layout/Table'

const SummaryCloseWorkOrder = ({
  reference,
  onJobSubmit,
  notes,
  time,
  date,
  changeStep,
}) => {
  const { handleSubmit } = useForm({})

  return (
    <div>
      <h1 className="lbh-heading-h1">Update work order: {reference}</h1>
      <form role="form" onSubmit={handleSubmit(onJobSubmit)}>
        <h4 className="lbh-heading-h4">Summary of updates to work order</h4>
        <Table>
          <TBody>
            <TR>
              <TH scope="row">Completion time</TH>
              <TD>
                {date.split('-').join('/')} {time}
              </TD>
              <TD>
                <a className="lbh-link" onClick={changeStep} href="#">
                  Edit
                </a>
              </TD>
            </TR>
            <TR>
              <TH scope="row">Notes</TH>
              <TD>{notes}</TD>
              <TD>
                <a className="lbh-link" onClick={changeStep} href="#">
                  Edit
                </a>
              </TD>
            </TR>
          </TBody>
        </Table>
        <PrimarySubmitButton label="Confirm and close" />
      </form>
    </div>
  )
}

SummaryCloseWorkOrder.propTypes = {
  reference: PropTypes.string.isRequired,
  onJobSubmit: PropTypes.func.isRequired,
  notes: PropTypes.string.isRequired,
  time: PropTypes.string,
  date: PropTypes.string,
  changeStep: PropTypes.func.isRequired,
}

export default SummaryCloseWorkOrder
