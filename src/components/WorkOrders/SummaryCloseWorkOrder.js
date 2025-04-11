import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PAYMENT_TYPE_FORM_DESCRIPTIONS } from '@/utils/paymentTypes'
import { PrimarySubmitButton } from '../Form'
import { Table, TBody, TR, TH, TD } from '../Layout/Table'
import dayjs from 'dayjs'
import PhotoListWithPreview from '../WorkOrder/Photos/PhotoListWithPreview'

const TableRow = (props) => {
  const { label, value } = props

  return (
    <TR>
      <TH
        width="one-quarter"
        scope="row"
      >
        {label}
      </TH>
      <TD width="three-quarters">{value}</TD>
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
  files,
  description,
  followOnData = null,
}) => {
  const { handleSubmit } = useForm({})

  return (
    <div>
      <h1 className="lbh-heading-h1">Close work order: {reference}</h1>
      <form
        role="form"
        onSubmit={handleSubmit(onJobSubmit)}
      >
        <h4 className="lbh-heading-h4">Summary of updates to work order</h4>
        <Table>
          <TBody>
            {startDate !== '' && (
              <TableRow
                label="Start time"
                value={dayjs(startDate).format('YYYY/MM/DD HH:mm:ss')}
              />
            )}

            <TableRow
              label="Completion time"
              value={dayjs(completionDate).format('YYYY/MM/DD HH:mm:ss')}
            />

            {paymentType && (
              <TableRow
                label="Payment type"
                value={PAYMENT_TYPE_FORM_DESCRIPTIONS[paymentType].text}
              />
            )}

            {operativeNames?.length > 0 && (
              <TableRow
                label="Operatives"
                value={operativeNames.join(', ')}
              />
            )}

            <TableRow
              label="Reason"
              value={reason}
            />

            <TableRow
              label="Notes"
              value={notes}
            />

            {files instanceof Array && files.length > 0 && (
              <TableRow
                label="Photos"
                value={
                  <>
                    <PhotoListWithPreview
                      fileUrls={files.map((x) => URL.createObjectURL(x))}
                    />

                    {description !== '' && description !== null && (
                      <p>{description}</p>
                    )}
                  </>
                }
              />
            )}
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
                        {followOnData.isSameTrade && (
                          <li style={{ marginTop: '5px' }}>Same trade</li>
                        )}
                        {followOnData.isDifferentTrades && (
                          <li style={{ marginTop: '5px' }}>
                            Different trade(s) (
                            {followOnData.requiredFollowOnTrades
                              .map((x) => x.value)
                              .join(', ')}
                            {followOnData.otherTrade &&
                              `: ${followOnData.otherTrade}`}
                            )
                          </li>
                        )}
                        {followOnData.isMultipleOperatives && (
                          <li style={{ marginTop: '5px' }}>
                            Multiple operatives
                          </li>
                        )}
                      </ul>

                      <div>{followOnData.followOnTypeDescription}</div>
                    </>
                  }
                />
                {followOnData.estimatedDuration && (
                  <TableRow
                    label="Estimated duration"
                    value={followOnData.estimatedDuration}
                  />
                )}
                {(followOnData.stockItemsRequired ||
                  followOnData.nonStockItemsRequired ||
                  followOnData.materialNotes !== '') && (
                  <TableRow
                    label="Materials required"
                    value={
                      <>
                        {(followOnData.stockItemsRequired ||
                          followOnData.nonStockItemsRequired) && (
                          <ul>
                            {followOnData.stockItemsRequired && (
                              <li style={{ marginTop: '5px' }}>
                                Stock items required
                              </li>
                            )}

                            {followOnData.nonStockItemsRequired && (
                              <li style={{ marginTop: '5px' }}>
                                Non stock items required
                              </li>
                            )}
                          </ul>
                        )}

                        {followOnData.materialNotes !== '' && (
                          <p>{followOnData.materialNotes}</p>
                        )}
                      </>
                    }
                  />
                )}

                <TableRow
                  label="Additional notes"
                  value={followOnData.additionalNotes}
                />
              </TBody>
            </Table>
          </>
        )}

        <div style={{ margin: '30px 0 0 0', display: 'flex' }}>
          {' '}
          <PrimarySubmitButton
            type="button"
            isSecondary={true}
            label="Go back and edit"
            onClick={changeStep}
            style={{ margin: '0' }}
          />
          <PrimarySubmitButton
            label="Confirm and close"
            style={{ margin: '-24px 0 0 15px' }}
          />
        </div>
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
  description: PropTypes.string,
  files: PropTypes.array,
  operativeNames: PropTypes.arrayOf(PropTypes.string),
}

export default SummaryCloseWorkOrder
