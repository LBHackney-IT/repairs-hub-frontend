import { useContext } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import WarningText from '../Template/WarningText'
import PageAnnouncement from '../Template/PageAnnouncement'
import { buildDataFromScheduleAppointment } from '@/utils/hact/jobStatusUpdate/notesForm'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import UserContext from '../UserContext'
import cx from 'classnames'

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

  const bannerToShow = () => {
    switch (props.action) {
      case 'close':
        return (
          <div className="govuk-panel govuk-panel--confirmation background-dark-green">
            <div className="govuk-panel__body">
              <strong>
                You have closed work order {props.workOrderReference}
              </strong>
            </div>
          </div>
        )
      case 'update':
        return (
          <div
            className={cx('govuk-panel govuk-panel--confirmation', {
              'background-dark-green': !props.requiresAuthorisation,
              'background-yellow': props.requiresAuthorisation,
            })}
          >
            <div
              className={cx('govuk-panel__body', {
                'text-black': props.requiresAuthorisation,
              })}
            >
              <strong>
                {props.requiresAuthorisation
                  ? `Work order ${props.workOrderReference} requires authorisation and has been sent to a manager`
                  : `Work order ${props.workOrderReference} has been successfully updated`}
              </strong>
            </div>
          </div>
        )
      case 'cancel':
        return (
          <div className="govuk-panel govuk-panel--confirmation lbh-panel">
            <h1 className="govuk-panel__title">Repair work order cancelled</h1>
            <div className="govuk-panel__body">
              <p>Work order number</p>
              <strong className="govuk-!-font-size-41">
                {props.workOrderReference}
              </strong>
            </div>
          </div>
        )
      default:
        return (
          <PageAnnouncement
            title={props.text}
            workOrderReference={props.workOrderReference}
          />
        )
    }
  }

  return (
    <>
      {bannerToShow()}
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

        {props.raiseNewRepair && (
          <li>
            <Link
              href={`/properties/${props.propertyReference}/raise-repair/new`}
            >
              <a className="lbh-link">
                <strong>New repair for {props.shortAddress}</strong>
              </a>
            </Link>
          </li>
        )}

        {props.linkToCloseWorkorder && (
          <li>
            <Link href={`/work-orders/${props.workOrderReference}/close`}>
              <a className="lbh-link">
                <strong>Close work order</strong>
              </a>
            </Link>
          </li>
        )}

        {props.shortAddress && !props.raiseNewRepair && (
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
                <strong>Manage work orders</strong>
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
