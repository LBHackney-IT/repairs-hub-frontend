import { Note, WorkOrderRequest } from '../../types'
import generateMessage from './generateMessage'

interface Props {
  note: Note
  workOrder: WorkOrderRequest
}

const CompletedNoteContent = ({ note, workOrder }: Props) => {
  const completionDate = new Date(workOrder.closedDated)
  
  const statusMessage = generateMessage(
    note.note,
    completionDate,
    workOrder.operatives,
    workOrder.paymentType
  )

  return (
    <>
      <span>
        {statusMessage}
        <br />
      </span>

      {Object.prototype.hasOwnProperty.call(workOrder, 'followOnRequest') &&
        workOrder.followOnRequest !== null && (
          <>
            <div style={{ background: '#eee', padding: '15px' }}>
              <span>
                <strong style={{ fontWeight: 700, color: '#333' }}>
                  Details of further work required
                </strong>{' '}
                <br />
                <br />
              </span>

              <span>
                <strong>Type of work required</strong>
              </span>

              <ul
                className="lbh-list lbh-list--bullet lbh-body-s"
                style={{ color: '#333' }}
              >
                {workOrder.followOnRequest.isSameTrade && (
                  <li style={{ marginTop: '5px' }}>Same trade</li>
                )}
                {workOrder.followOnRequest.isDifferentTrades && (
                  <li style={{ marginTop: '5px' }}>
                    Different trade(s):{' '}
                    {workOrder.followOnRequest.requiredFollowOnTrades.join(
                      ', '
                    )}
                  </li>
                )}
                {workOrder.followOnRequest.isMultipleOperatives && (
                  <li style={{ marginTop: '5px' }}>Multiple operatives</li>
                )}
              </ul>

              {workOrder.followOnRequest.followOnTypeDescription !== null &&
                workOrder.followOnRequest.followOnTypeDescription.trim()
                  .length > 0 && (
                  <>
                    <br />
                    <span style={{ color: '#333' }}>
                      {workOrder.followOnRequest.followOnTypeDescription}
                      <br />
                    </span>
                  </>
                )}

              {(workOrder.followOnRequest.stockItemsRequired ||
                workOrder.followOnRequest.nonStockItemsRequired ||
                (workOrder.followOnRequest.materialNotes !== null &&
                  workOrder.followOnRequest.materialNotes.trim().length >
                    0)) && (
                <>
                  <br />
                  <span>
                    <strong>Materials required</strong>
                  </span>

                  {(workOrder.followOnRequest.stockItemsRequired ||
                    workOrder.followOnRequest.nonStockItemsRequired) && (
                    <ul
                      className="lbh-list lbh-list--bullet lbh-body-s"
                      style={{ color: '#333' }}
                    >
                      {workOrder.followOnRequest.stockItemsRequired && (
                        <li style={{ marginTop: '5px' }}>
                          Stock items required
                        </li>
                      )}

                      {workOrder.followOnRequest.nonStockItemsRequired && (
                        <li style={{ marginTop: '5px' }}>
                          Non stock items required
                        </li>
                      )}
                    </ul>
                  )}

                  {workOrder.followOnRequest.materialNotes !== null &&
                    workOrder.followOnRequest.materialNotes.trim().length >
                      0 && (
                      <>
                        <br />
                        <span style={{ color: '#333' }}>
                          {workOrder.followOnRequest.materialNotes}
                          <br />
                        </span>
                      </>
                    )}
                </>
              )}

              {workOrder.followOnRequest.additionalNotes !== null &&
                workOrder.followOnRequest.additionalNotes.trim().length > 0 && (
                  <>
                    <br />

                    <span>
                      <strong>Additional notes</strong>
                      <br />
                    </span>

                    <span style={{ color: '#333' }}>
                      {workOrder.followOnRequest.additionalNotes}
                    </span>
                    <br />
                  </>
                )}
            </div>
          </>
        )}

      {/* To do - add back later */}
      {/* <span>
        <a href="#photos-tab">2 photos uploaded</a> <br />
      </span> */}
    </>
  )
}

export default CompletedNoteContent
