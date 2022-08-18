import PropTypes from 'prop-types'
import { WorkOrder } from '@/models/workOrder'
import { formatDateTime } from 'src/utils/time'
import { CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES } from '@/utils/statusCodes'
import { getCautionaryAlertsType } from '@/utils/cautionaryAlerts'
import WarningText from '@/components/Template/WarningText'

const PrintJobTicketDetails = ({
  workOrder,
  property,
  cautionaryAlerts,
  tasksAndSors,
}) => {
  const cautionaryAlertsType = getCautionaryAlertsType([
    ...cautionaryAlerts,
  ]).join(', ')

  const readOnly = CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES.includes(
    workOrder.status
  )

  return (
    <>
      <div className="print-work-order">
        <div>
          <h1 className="lbh-heading-h1 display-inline govuk-!-font-weight-bold">
            Job Ticket
          </h1>
          <div className="logo">
            <svg
              className="lbh-header__logo"
              role="presentation"
              focusable="false"
              width="208px"
              height="37px"
              viewBox="0 0 208 37"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Hackney logo</title>
              <g stroke="none" fill="black" fillRule="evenodd">
                <path d="M36,15.9985404 C36,9.03922642 32.0578091,3.00529101 26.2909886,0 L26.2909886,12.0328407 L9.70901142,12.0328407 L9.70901142,0 C3.94073354,3.00529101 0,9.03922642 0,15.9985404 C0,22.9607736 3.94073354,28.9961686 9.70901142,32 L9.70901142,19.9671593 L26.2909886,19.9671593 L26.2909886,32 C32.0578091,28.9961686 36,22.959314 36,15.9985404"></path>
                <polyline points="42 1 50.8590247 1 50.8590247 11.1301668 59.1380971 11.1301668 59.1380971 1 68 1 68 30 59.1380971 30 59.1380971 18.5708703 50.8590247 18.5708703 50.8590247 30 42 30 42 1"></polyline>
                <path d="M91.0145371,16.1849059 C91.0145371,12.1530391 91.0951926,8 80.9296736,8 C75.887975,8 70.2303622,8.96793653 69.9854629,14.8548948 L77.5274802,14.8548948 C77.5700077,13.9417743 78.0612726,12.6824471 80.5615914,12.6824471 C81.8711426,12.6824471 83.2246876,13.2089699 83.2246876,14.6327454 C83.2246876,15.9728542 82.1175083,16.2974231 81.0117955,16.5008196 C76.870505,17.2725723 69,17.028785 69,23.6889384 C69,28.0756672 72.4021933,30 76.5038893,30 C79.1259245,30 81.6247768,29.4359714 83.346404,27.5145236 L83.4299923,27.5145236 C83.3874649,28.0367189 83.5121143,28.8849256 83.7159526,29.4489542 L92,29.4489542 C91.0951926,28.116058 91.0145371,26.3403056 91.0145371,24.7679496 L91.0145371,16.1849059 Z M83.2246876,21.986755 C83.1015047,24.1635303 81.6687707,25.2526392 79.8224943,25.2526392 C78.3486993,25.2526392 77.2811145,24.2832601 77.2811145,23.3167661 C77.2811145,21.9059734 78.2255164,21.4631172 80.027799,21.0606518 C81.1335119,20.8197495 82.2406912,20.5355714 83.2246876,20.053767 L83.2246876,21.986755 L83.2246876,21.986755 Z"></path>
                <path d="M106.908596,16.4807453 C106.823548,15.6320934 106.532598,14.9465328 105.989491,14.5149905 C105.489653,14.0719019 104.780928,13.8308732 103.905092,13.8308732 C100.735971,13.8308732 100.274927,16.4865184 100.274927,19.0223709 C100.274927,21.5567802 100.735971,24.1691268 103.905092,24.1691268 C105.697048,24.1691268 106.948881,22.7604802 107.115991,21.1136915 L115,21.1136915 C114.206228,26.8074526 109.577879,30 103.737982,30 C97.2236782,30 92,25.6383914 92,19.0165978 C92,12.4020206 97.2236782,8 103.737982,8 C109.409277,8 114.249497,10.7061602 114.749335,16.4807453 L106.908596,16.4807453"></path>
                <polyline points="115 1 123.245818 1 123.245818 15.0160369 128.483831 8.93525108 137.794201 8.93525108 130.104448 16.8806756 139 30 129.106802 30 124.7014 22.3510574 123.245818 23.8959607 123.245818 30 115 30 115 1"></polyline>
                <path
                  d="M139,8.55177515 L146.79367,8.55177515 L146.79367,11.2677515 L146.873792,11.2677515 C148.375712,9.1183432 150.528804,8 153.736591,8 C157.531453,8 161,10.3579882 161,15.285503 L161,30 L152.920805,30 L152.920805,18.7559172 C152.920805,16.2781065 152.63528,14.5414201 150.284068,14.5414201 C148.904516,14.5414201 147.077738,15.2426036 147.077738,18.6745562 L147.077738,30 L139,30 L139,8.55177515"
                  id="Fill-18"
                ></path>
                <path d="M185,20.7649334 C185,12.6088781 181.402905,8 173.076217,8 C166.446107,8 162,12.9305619 162,19.0338994 C162,26.0618976 167.055025,30 173.763237,30 C178.531883,30 182.938938,27.9097764 184.557414,23.411973 L177.076846,23.411973 C176.436109,24.4130877 175.020123,24.9064324 173.727078,24.9064324 C171.219092,24.9064324 169.845051,23.1811684 169.641114,20.7649334 L185,20.7649334 Z M169.684505,16.621992 C170.046095,14.3485673 171.420136,13.0906826 173.802289,13.0906826 C175.864797,13.0906826 177.318388,14.6731362 177.318388,16.621992 L169.684505,16.621992 L169.684505,16.621992 Z"></path>
                <path d="M200.955311,28.5221077 C200.298901,30.3958684 199.56337,32.7989483 198.29304,34.3912803 C196.164103,37.0407925 192.887912,37 189.733333,37 L186.048352,37 L186.048352,30.5577263 L187.92967,30.5577263 C188.750183,30.5577263 189.813919,30.6408425 190.389744,30.3550393 C190.880586,30.1115234 191.1663,29.7032331 191.1663,28.7670818 C191.1663,27.7463561 188.054212,19.964052 187.604396,18.7406393 L184,9 L192.681319,9 L196.082051,21.1451774 L196.164103,21.1451774 L199.604396,9 L208,9 L200.955311,28.5221077"></path>
              </g>
              <image
                src="/assets/images/lbh-logo.png"
                xlinkHref=""
                className="lbh-header__logo-fallback-image"
                width="206"
                height="37"
              ></image>
            </svg>
          </div>
        </div>

        <span className="lbh-header__logo-text">Hackney</span>

        <div className="header-tables">
          <table className="govuk-!-padding-top-2 govuk-!-padding-bottom-2">
            <tbody>
              <tr>
                <td className="lbh-body-s">
                  <strong>Work order number: </strong>
                  {workOrder.reference.toString().padStart(8, '0')}
                </td>
              </tr>
              <tr>
                <td className="lbh-body-s">
                  <strong>Appointment date: </strong>
                  {workOrder.appointment && (
                    <>
                      {
                        formatDateTime(
                          new Date(workOrder.appointment['date'])
                        ).split(',')[0]
                      }
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="lbh-body-s">
                  <strong>Appointment slot: </strong>
                  {workOrder.appointment && (
                    <>{workOrder?.appointment['description']}</>
                  )}
                </td>
              </tr>
              <tr>
                <td className="lbh-body-s">
                  <strong>
                    {workOrder.operatives.length > 1
                      ? 'Operatives: '
                      : 'Operative: '}
                  </strong>
                  {workOrder.operatives.length > 0 &&
                    ((workOrder.appointment &&
                      workOrder.appointmentISODatePassed()) ||
                      readOnly) && (
                      <>
                        {`${workOrder.operatives
                          .map((operative) => operative.name)
                          .join(', ')}`}
                      </>
                    )}
                </td>
              </tr>
              <tr>
                <td className="lbh-body-s">
                  <strong>Raised by: </strong>
                  <>{workOrder.raisedBy}</>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="govuk-!-margin-top-0 govuk-!-padding-top-2 govuk-!-padding-bottom-2">
            <tbody>
              <tr>
                <td className="lbh-body-s">
                  <strong>Address: </strong>
                  {property.address.addressLine}
                  <br />
                  {property.address.streetSuffix &&
                    property.address.streetSuffix}
                  {property.address.streetSuffix && <br />}
                  {property.address.postalCode}
                </td>
              </tr>
              <tr>
                <td className="lbh-body-s">
                  <strong>Neighbourhood: </strong>
                  {property.tmoName}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="govuk-!-margin-top-4">
          <h3 className="lbh-heading-h3 display-inline govuk-!-font-weight-bold">
            Customer information
          </h3>

          <div className="customer-information">
            <table>
              <tbody>
                <tr>
                  <td className="lbh-body-s">
                    <strong>Name: </strong>
                    {workOrder.callerName}
                  </td>
                </tr>

                <tr>
                  <td className="lbh-body-s">
                    <strong>Phone number: </strong>
                    {workOrder.callerNumber}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="govuk-!-margin-top-0">
              <tbody>
                <tr>
                  <td className="lbh-body-s">
                    <strong>Appointment notes: </strong>
                    {workOrder.appointment && (
                      <>{workOrder.appointment['note'] || 'None'}</>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {cautionaryAlertsType && <WarningText text={cautionaryAlertsType} />}

        <hr />

        <div className="govuk-!-margin-top-4">
          <h3 className="lbh-heading-h3 display-inline govuk-!-font-weight-bold">
            Job information
          </h3>

          <div className="job-fields">
            <div className="display-inline">
              <p className="lbh-body-s display-inline">
                <strong>Trade: </strong>
                {workOrder.tradeCode}
              </p>
            </div>
            <div className="display-inline govuk-!-margin-left-4">
              <p className="lbh-body-s display-inline">
                <strong>Contract: </strong>
                {workOrder.contractorReference}
              </p>
            </div>
            <div className="display-inline govuk-!-margin-left-4">
              <p className="lbh-body-s display-inline">
                <strong>Priority: </strong>
                {workOrder.priority}
              </p>
            </div>
          </div>

          <div className="govuk-!-margin-top-4">
            <p className="lbh-body-s display-inline">
              <strong>Job description: </strong>
              {workOrder.description}
            </p>
          </div>

          <div className="govuk-!-margin-top-4">
            <p className="lbh-body-s display-inline">
              <strong>Planner comments: </strong>
              {workOrder.plannerComments}
            </p>
          </div>

          <table className="sors govuk-!-margin-top-6 govuk-!-margin-bottom-3">
            <thead>
              <tr className="lbh-body-s govuk-!-font-weight-bold">
                <th>SOR</th>
                <th>Description</th>
                <th>Units</th>
                <th>SMV</th>
              </tr>
            </thead>

            <tbody className="lbh-body-s govuk">
              {tasksAndSors.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.code}</td>
                  <td>{entry.description}</td>
                  <td>{entry.quantity}</td>
                  <td>{entry.standardMinuteValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div id="rear-image-container"></div>
      </div>
    </>
  )
}

PrintJobTicketDetails.propTypes = {
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  property: PropTypes.object.isRequired,
  tasksAndSors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      description: PropTypes.string,
      quantity: PropTypes.number,
      standardMinuteValue: PropTypes.number,
    })
  ).isRequired,
}

export default PrintJobTicketDetails
