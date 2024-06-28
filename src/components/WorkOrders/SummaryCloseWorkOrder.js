import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PAYMENT_TYPE_FORM_DESCRIPTIONS } from '@/utils/paymentTypes'
import { PrimarySubmitButton } from '../Form'
import { Table, TBody, TR, TH, TD } from '../Layout/Table'
import dayjs from 'dayjs'

const TableRow = (props) => {
  const { label, value, handleClick } = props

  return (
    <TR>
      <TH width="one-quarter" scope="row">
        {label}
      </TH>
      <TD width="two-quarters">{value}</TD>
      <TD width="one-quarter">
        <a
          className="lbh-link"
          onClick={handleClick}
          style={{ textAlign: 'right', display: 'block' }}
          href="#"
        >
          Edit
        </a>
      </TD>
    </TR>
  )
}

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
  followOnData = null,
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
              <TableRow
                label="Start time"
                value={dayjs(startDate).format('YYYY/MM/DD HH:mm:ss')}
                handleClick={changeStep}
              />
            )}

            <TableRow
              label="Completion time"
              value={dayjs(completionDate).format('YYYY/MM/DD HH:mm:ss')}
              handleClick={changeStep}
            />

            {paymentType && (
              <TableRow
                label="Payment type"
                value={PAYMENT_TYPE_FORM_DESCRIPTIONS[paymentType].text}
                handleClick={changeStep}
              />
            )}

            {operativeNames?.length > 0 && (
              <TableRow
                label="Operatives"
                value={operativeNames.join(', ')}
                handleClick={changeStep}
              />
            )}

            <TableRow label="Reason" value={reason} handleClick={changeStep} />

            <TableRow label="Notes" value={notes} handleClick={changeStep} />
          </TBody>
        </Table>

        {followOnData !== null && (
          <>
            <h4 className="lbh-heading-h4">Summary of further work required</h4>
            <Table>
              <TBody>
                <TableRow
                  label="Type of work required"
                  value={
                    <>
                      <ul>
                        {followOnData['isSameTrade'] && (
                          <li style={{ marginTop: '5px' }}>Same trade</li>
                        )}
                        {followOnData['isDifferentTrades'] && (
                          <li style={{ marginTop: '5px' }}>
                            Different trade(s) (
                            {followOnData['requiredFollowOnTrades']
                              .map((x) => x.label)
                              .join(', ')}
                            )
                          </li>
                        )}
                        {followOnData['isMultipleOperatives'] && (
                          <li style={{ marginTop: '5px' }}>
                            Multiple operatives
                          </li>
                        )}
                      </ul>

                      <div>{followOnData['followOnTypeDescription']}</div>
                    </>
                  }
                  handleClick={changeStep}
                />

                <TableRow
                  label="Materials required"
                  value={
                    <>
                      <ul>
                        {followOnData['stockItemsRequired'] && (
                          <li style={{ marginTop: '5px' }}>
                            Stock items required
                          </li>
                        )}

                        {followOnData['nonStockItemsRequired'] && (
                          <li style={{ marginTop: '5px' }}>
                            Non stock items required
                          </li>
                        )}
                      </ul>

                      <p>{followOnData['materialNotes']}</p>
                    </>
                  }
                  handleClick={changeStep}
                />

                <TableRow
                  label="Additional notes"
                  value={followOnData['additionalNotes']}
                  handleClick={changeStep}
                />
              </TBody>
            </Table>
          </>
        )}

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
