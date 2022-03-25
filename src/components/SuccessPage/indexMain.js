// import { useContext } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import WarningText from '../Template/WarningText'
// import PageAnnouncement from '../Template/PageAnnouncement'
// import { buildDataFromScheduleAppointment } from '@/utils/hact/jobStatusUpdate/notesForm'
// import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
// import UserContext from '../UserContext'

const SuccessPage = ({ ...props }) => {
  const { user } = useContext(UserContext)

  //   const openExternalLinkEventHandler = async () => {
  //     const jobStatusUpdate = buildDataFromScheduleAppointment(
  //       props.workOrderReference.toString(),
  //       `${user.name} opened the DRS Web Booking Manager`
  //     )

  //     await frontEndApiRequest({
  //       method: 'post',
  //       path: `/api/jobStatusUpdate`,
  //       requestData: jobStatusUpdate,
  //     })
  //   }

  return (
    <>
      {props.banner}
      {props.warningText && <WarningText text={props.warningText} />}
      <ul className="lbh-list lbh-!-margin-top-9">
        {props.links.map((link, i) => {
          return (
            <li key={i}>
              <Link href={link.href}>
                <a className="lbh-link" onClick={link.onClick}>
                  {link.text}
                </a>
              </Link>
            </li>
          )
        })}
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
  links: PropTypes.array,
  banner: PropTypes.any,
}

export default SuccessPage
