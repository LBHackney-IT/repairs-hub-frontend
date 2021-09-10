import { useContext, useState } from 'react'
import UserContext from '../UserContext/UserContext'
import HeaderComponent from './Header/Header'
import cx from 'classnames'
import { HEADER_LINKS } from '../../utils/headerLinks'

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
              {user &&
                HEADER_LINKS.map((link) => {
                  if (
                    link.permittedRoles.some((role) =>
                      user.roles.includes(role)
                    )
                  ) {
                    return (
                      <li>
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
                  }
                })}
            </ol>
          </div>
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
