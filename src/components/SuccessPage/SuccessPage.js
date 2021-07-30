import { useContext } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import WarningText from '../Template/WarningText'
import PageAnnouncement from '../Template/PageAnnouncement'
import { buildDataFromScheduleAppointment } from '../../utils/hact/jobStatusUpdate/notesForm'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import UserContext from '../UserContext/UserContext'

const SuccessPage = ({ ...props }) => {
  const { user } = useContext(UserContext)

  const openExternalLinkEventHandler = async () => {
    const jobStatusUpdate = buildDataFromScheduleAppointment(
      props.workOrderReference.toString(),
      `${user.name} opened the DRS Web Booking Manager`
    )

    await frontEndApiRequest({
      method: 'post',
      path: `/api/jobStatusUpdate`,
      requestData: jobStatusUpdate,
    })
  }

  return (
    <>
      <PageAnnouncement
        title={props.text}
        workOrderReference={props.workOrderReference}
      />

      {props.authorisationPendingApproval && (
        <WarningText
          text={`Work order ${props.workOrderReference} requires authorisation. Please request authorisation from a manager.`}
        />
      )}

      <ul className="lbh-list lbh-!-margin-top-9">
        {props.externalSchedulerLink && (
          <li>
            Please{' '}
            <Link href={props.externalSchedulerLink}>
              <a
                className="lbh-link"
                target="_blank"
                rel="noopener"
                onClick={openExternalLinkEventHandler}
              >
                <strong>open DRS</strong>
              </a>
            </Link>{' '}
            to book an appointment
          </li>
        )}

        {props.immediateOrEmergencyDloRepairText && (
          <li>
            <p>
              <strong>
                Emergency and immediate DLO repairs are sent directly to the
                Planners. An appointment does not need to be booked.
              </strong>
            </p>
          </li>
        )}

        {props.workOrderReference && (
          <li>
            <Link href={`/work-orders/${props.workOrderReference}`}>
              <a className="lbh-link">
                <strong>View work order</strong>
              </a>
            </Link>
          </li>
        )}

        {props.shortAddress && (
          <li>
            <Link href={`/properties/${props.propertyReference}`}>
              <a className="lbh-link">
                <strong>Back to {props.shortAddress}</strong>
              </a>
            </Link>
          </li>
        )}

        {props.showSearchLink && (
          <li>
            <Link href="/">
              <a className="lbh-link">
                <strong>Start a new search</strong>
              </a>
            </Link>
          </li>
        )}

        {props.showDashboardLink && (
          <li>
            <Link href="/">
              <a className="lbh-link">
                <strong>Back to dashboard</strong>
              </a>
            </Link>
          </li>
        )}

        {props.showNewWorkOrderLink && (
          <li>
            <Link
              href={`/properties/${props.propertyReference}/raise-repair/new`}
            >
              <a className="lbh-link">
                <strong>Raise a new work order</strong>
              </a>
            </Link>
          </li>
        )}
      </ul>
    </>
  )
}

SuccessPage.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  showDashboardLink: PropTypes.bool,
  showNewWorkOrderLink: PropTypes.bool,
  propertyReference: PropTypes.string,
  shortAddress: PropTypes.string,
  showSearchLink: PropTypes.bool,
  authorisationPendingApproval: PropTypes.bool,
}

export default SuccessPage
