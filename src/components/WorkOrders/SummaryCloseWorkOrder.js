import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PAYMENT_TYPE_FORM_DESCRIPTIONS } from '@/utils/paymentTypes'
import { PrimarySubmitButton } from '../Form'
import { Table, TBody, TR, TH, TD } from '../Layout/Table'
import dayjs from 'dayjs'

const SummaryCloseWorkOrder = ({
  reference,
  onJobSubmit,
  notes,
  completionDate,
  changeStep,
  reason,
  operativeNames,
  paymentType,
  startDate,
}) => {
  const { handleSubmit } = useForm({})

  return (
    <div>
      <h1 className="lbh-heading-h1">Close work order: {reference}</h1>
      <form role="form" onSubmit={handleSubmit(onJobSubmit)}>
        <h4 className="lbh-heading-h4">Summary of updates to work order</h4>
        <Table>
          <TBody>
            {startDate !== '' && (
              <TR>
                <TH scope="row">Start time</TH>
                <TD>{dayjs(startDate).format('YYYY/MM/DD HH:mm:ss')}</TD>
                <TD>
                  <a className="lbh-link" onClick={changeStep} href="#">
                    Edit
                  </a>
                </TD>
              </TR>
            )}

            <TR>
              <TH scope="row">Completion time</TH>
              <TD>{dayjs(completionDate).format('YYYY/MM/DD HH:mm:ss')}</TD>
              <TD>
                <a className="lbh-link" onClick={changeStep} href="#">
                  Edit
                </a>
              </TD>
            </TR>

            {paymentType && (
              <TR>
                <TH scope="row">Payment type</TH>
                <TD>{PAYMENT_TYPE_FORM_DESCRIPTIONS[paymentType].text}</TD>
                <TD>
                  <a className="lbh-link" onClick={changeStep} href="#">
                    Edit
                  </a>
                </TD>
              </TR>
            )}

            {operativeNames?.length > 0 && (
              <TR>
                <TH scope="row">Operatives</TH>
                <TD>{operativeNames.join(', ')}</TD>
                <TD>
                  <a className="lbh-link" onClick={changeStep} href="#">
                    Edit
                  </a>
                </TD>
              </TR>
            )}

            <TR>
              <TH scope="row">Reason</TH>
              <TD>{reason}</TD>
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
  reference: PropTypes.number.isRequired,
  onJobSubmit: PropTypes.func.isRequired,
  notes: PropTypes.string.isRequired,
  completionDate: PropTypes.string,
  startDate: PropTypes.string,
  changeStep: PropTypes.func.isRequired,
  reason: PropTypes.string.isRequired,
  paymentType: PropTypes.string,
}

export default SummaryCloseWorkOrder
