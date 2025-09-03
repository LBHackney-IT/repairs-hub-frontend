import PropTypes from 'prop-types'
import { useContext, useState } from 'react'
import UserContext from '../UserContext'
import HeaderComponent from './Header'
import PhaseBanner from './PhaseBanner'
import cx from 'classnames'
import { headerLinksForUser } from '@/utils/headerLinks'
import FlashMessageContext from '../FlashMessageContext'
import { useRouter } from 'next/router'
import { canAttendOwnWorkOrder } from '@/utils/userPermissions'

// random change

const Layout = ({ serviceName, children }) => {
  const { user } = useContext(UserContext)
  const router = useRouter()
  const MOBILE_PATHNAMES_WITH_FEEDBACK_BANNER = ['/login', '/']

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [modalFlashMessage, setModalFlashMessage] = useState('')

  return (
    <>
      <HeaderComponent
        serviceName={serviceName}
        toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />
      {MOBILE_PATHNAMES_WITH_FEEDBACK_BANNER.includes(router.pathname) &&
        canAttendOwnWorkOrder(user) &&
        !mobileMenuOpen && <PhaseBanner />}

      {!canAttendOwnWorkOrder(user) && !mobileMenuOpen && <PhaseBanner />}

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
                        href={link.href}
                        className="lbh-link lbh-body-l"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        target={link.id == 'support-page' ? '_blank' : ''}
                        rel="noreferrer"
                      >
                        {link.description}
                      </a>
                    </li>
                  )
                })}
            </ol>
          </div>
        )}

        {modalFlashMessage && (
          <div
            className="modal-container"
            onClick={(e) => {
              const isOutsideClick = !e.target.closest('.modal-panel')

              if (isOutsideClick) {
                setModalFlashMessage('')
              }
            }}
          >
            <div className="modal-panel">
              <div className="close-icon-container">
                <div
                  onClick={() => {
                    setModalFlashMessage('')
                  }}
                >
                  <svg
                    data-testid="modal-close"
                    width="35"
                    height="35"
                    viewBox="5 5 29.56 31.06"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.16312 6.67098L28.4552 25.963C28.865 26.3728 29.4234 26.4788 29.7024 26.1998L30.9656 24.9366C31.2447 24.6575 31.1387 24.0991 30.7289 23.6893L11.4368 4.39727C11.027 3.98746 10.4686 3.88148 10.1896 4.16054L8.92639 5.42371C8.64732 5.70278 8.7533 6.26116 9.16312 6.67098Z"
                      fill="white"
                    />
                    <path
                      d="M30.8942 6.49911L11.4992 25.894C11.0872 26.306 10.5152 26.4019 10.2214 26.1082L8.89182 24.7786C8.59808 24.4848 8.69394 23.9128 9.10594 23.5008L28.5009 4.10582C28.9129 3.69382 29.4849 3.59796 29.7787 3.8917L31.1083 5.22131C31.402 5.51505 31.3062 6.0871 30.8942 6.49911Z"
                      fill="white"
                    />
                    <path
                      d="M8.50413 36.06C7.8108 36.06 7.18413 35.9067 6.62413 35.6C6.0708 35.2933 5.63413 34.87 5.31413 34.33C5.0008 33.7833 4.84413 33.1733 4.84413 32.5C4.84413 31.8267 5.0008 31.22 5.31413 30.68C5.63413 30.1333 6.07413 29.7067 6.63413 29.4C7.19413 29.0933 7.8208 28.94 8.51413 28.94C9.03413 28.94 9.51413 29.0267 9.95413 29.2C10.3941 29.3733 10.7675 29.6267 11.0741 29.96L10.6041 30.43C10.0575 29.8767 9.36746 29.6 8.53413 29.6C7.9808 29.6 7.47746 29.7267 7.02413 29.98C6.5708 30.2333 6.21413 30.58 5.95413 31.02C5.7008 31.46 5.57413 31.9533 5.57413 32.5C5.57413 33.0467 5.7008 33.54 5.95413 33.98C6.21413 34.42 6.5708 34.7667 7.02413 35.02C7.47746 35.2733 7.9808 35.4 8.53413 35.4C9.37413 35.4 10.0641 35.12 10.6041 34.56L11.0741 35.03C10.7675 35.3633 10.3908 35.62 9.94413 35.8C9.50413 35.9733 9.02413 36.06 8.50413 36.06ZM12.1971 29H12.9371V35.36H16.8571V36H12.1971V29ZM20.5545 36.06C19.8612 36.06 19.2312 35.9067 18.6645 35.6C18.1045 35.2867 17.6645 34.86 17.3445 34.32C17.0312 33.78 16.8745 33.1733 16.8745 32.5C16.8745 31.8267 17.0312 31.22 17.3445 30.68C17.6645 30.14 18.1045 29.7167 18.6645 29.41C19.2312 29.0967 19.8612 28.94 20.5545 28.94C21.2478 28.94 21.8712 29.0933 22.4245 29.4C22.9845 29.7067 23.4245 30.1333 23.7445 30.68C24.0645 31.22 24.2245 31.8267 24.2245 32.5C24.2245 33.1733 24.0645 33.7833 23.7445 34.33C23.4245 34.87 22.9845 35.2933 22.4245 35.6C21.8712 35.9067 21.2478 36.06 20.5545 36.06ZM20.5545 35.4C21.1078 35.4 21.6078 35.2767 22.0545 35.03C22.5012 34.7767 22.8512 34.43 23.1045 33.99C23.3578 33.5433 23.4845 33.0467 23.4845 32.5C23.4845 31.9533 23.3578 31.46 23.1045 31.02C22.8512 30.5733 22.5012 30.2267 22.0545 29.98C21.6078 29.7267 21.1078 29.6 20.5545 29.6C20.0012 29.6 19.4978 29.7267 19.0445 29.98C18.5978 30.2267 18.2445 30.5733 17.9845 31.02C17.7312 31.46 17.6045 31.9533 17.6045 32.5C17.6045 33.0467 17.7312 33.5433 17.9845 33.99C18.2445 34.43 18.5978 34.7767 19.0445 35.03C19.4978 35.2767 20.0012 35.4 20.5545 35.4ZM27.3586 36.06C26.8386 36.06 26.3386 35.9767 25.8586 35.81C25.3853 35.6433 25.0186 35.4233 24.7586 35.15L25.0486 34.58C25.302 34.8333 25.6386 35.04 26.0586 35.2C26.4786 35.3533 26.912 35.43 27.3586 35.43C27.9853 35.43 28.4553 35.3167 28.7686 35.09C29.082 34.8567 29.2386 34.5567 29.2386 34.19C29.2386 33.91 29.152 33.6867 28.9786 33.52C28.812 33.3533 28.6053 33.2267 28.3586 33.14C28.112 33.0467 27.7686 32.9467 27.3286 32.84C26.802 32.7067 26.382 32.58 26.0686 32.46C25.7553 32.3333 25.4853 32.1433 25.2586 31.89C25.0386 31.6367 24.9286 31.2933 24.9286 30.86C24.9286 30.5067 25.022 30.1867 25.2086 29.9C25.3953 29.6067 25.682 29.3733 26.0686 29.2C26.4553 29.0267 26.9353 28.94 27.5086 28.94C27.9086 28.94 28.2986 28.9967 28.6786 29.11C29.0653 29.2167 29.3986 29.3667 29.6786 29.56L29.4286 30.15C29.1353 29.9567 28.822 29.8133 28.4886 29.72C28.1553 29.62 27.8286 29.57 27.5086 29.57C26.8953 29.57 26.432 29.69 26.1186 29.93C25.812 30.1633 25.6586 30.4667 25.6586 30.84C25.6586 31.12 25.742 31.3467 25.9086 31.52C26.082 31.6867 26.2953 31.8167 26.5486 31.91C26.8086 31.9967 27.1553 32.0933 27.5886 32.2C28.102 32.3267 28.5153 32.4533 28.8286 32.58C29.1486 32.7 29.4186 32.8867 29.6386 33.14C29.8586 33.3867 29.9686 33.7233 29.9686 34.15C29.9686 34.5033 29.872 34.8267 29.6786 35.12C29.492 35.4067 29.202 35.6367 28.8086 35.81C28.4153 35.9767 27.932 36.06 27.3586 36.06ZM36.0764 35.36V36H31.1264V29H35.9264V29.64H31.8664V32.13H35.4864V32.76H31.8664V35.36H36.0764Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              <div className="message lbh-body-l">{modalFlashMessage}</div>
            </div>
          </div>
        )}

        <div
          className={cx('lbh-container', 'govuk-!-margin-top-5', {
            'govuk-!-display-none': mobileMenuOpen,
          })}
        >
          <FlashMessageContext.Provider value={{ setModalFlashMessage }}>
            {children}
          </FlashMessageContext.Provider>
        </div>
      </main>
    </>
  )
}

Layout.propTypes = {
  serviceName: PropTypes.string.isRequired,
  feedbackLink: PropTypes.string,
}

export default Layout
