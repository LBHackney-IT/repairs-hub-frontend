import { useContext, useState } from 'react'
import { canManageJobs } from '../../utils/userPermissions'
import UserContext from '../UserContext/UserContext'
import HeaderComponent from './Header/Header'
import cx from 'classnames'

const Layout = ({ children }) => {
  const { user } = useContext(UserContext)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
              {user && canManageJobs(user) && (
                <li>
                  <a
                    className="lbh-link"
                    id="manage"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    href="/"
                  >
                    Manage work orders
                  </a>
                </li>
              )}
              <li>
                <a
                  className="lbh-link"
                  id="search"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  href="/search"
                >
                  Search
                </a>
              </li>
              <li>
                <a
                  className="lbh-link"
                  id="signout"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  href="/logout"
                >
                  Sign out
                </a>
              </li>
            </ol>
          </div>
        )}

        <div className="lbh-container govuk-!-margin-top-5">{children}</div>
      </main>
    </>
  )
}

export default Layout
