import { useContext, useState } from 'react'
import UserContext from '../UserContext/UserContext'
import HeaderComponent from './Header/Header'
import cx from 'classnames'
import { headerLinksForUser } from '../../utils/headerLinks'
import Cookies from 'universal-cookie'

const Layout = ({ children }) => {
  const { user } = useContext(UserContext)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cookies = new Cookies()

  let justAttendedWorkOrder = cookies.get(
    process.env.NEXT_PUBLIC_WORK_ORDER_SESSION_COOKIE_NAME
  )

  return (
    <>
      <HeaderComponent
        serviceName="Repairs Hub"
        toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />

      {!mobileMenuOpen && (
        <div className="govuk-phase-banner lbh-phase-banner lbh-container govuk-!-display-none-print">
          <p className="govuk-phase-banner__content">
            <strong className="govuk-tag govuk-phase-banner__content__tag lbh-tag">
              Beta
            </strong>
            <span className="govuk-phase-banner__text">
              This is our new website design - it's work in progress.
              <span> </span>
              <a
                href={`mailto:repairshub.feedback@hackney.gov.uk`}
                title="Tell us what you think"
              >
                Tell us what you think
              </a>
              , your feedback will help us to improve it.
            </span>
          </p>
        </div>
      )}

      <main
        className={cx('lbh-main-wrapper', {
          'govuk-!-padding-top-0': mobileMenuOpen,
        })}
        id="main-content"
        role="main"
      >
        {mobileMenuOpen && (
          <div className="mobile-menu-container">
            <ol className="mobile-menu">
              {user &&
                headerLinksForUser(user).map((link, index) => {
                  return (
                    <li key={index}>
                      <a
                        id={link.id}
                        href={`/${link.href}`}
                        className="lbh-link lbh-body-l"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      >
                        {link.description}
                      </a>
                    </li>
                  )
                })}
            </ol>
          </div>
        )}

        {justAttendedWorkOrder && (
          <div className="modal-window">{`Work order ${
            justAttendedWorkOrder?.id
          } successfully ${
            justAttendedWorkOrder?.reason === 'No Access'
              ? 'closed with no access'
              : 'completed'
          }`}</div>
        )}

        <div
          className={cx('lbh-container', 'govuk-!-margin-top-5', {
            'govuk-!-display-none': mobileMenuOpen,
          })}
        >
          {children}
        </div>
      </main>
    </>
  )
}

export default Layout
