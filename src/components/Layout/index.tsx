import { ReactNode, useState } from 'react'
import HeaderComponent from './Header'
import MobileMenu from './MobileMenu'
import ModalFlashMessage from './ModalFlashMessage'
import cx from 'classnames'
import FlashMessageContext from '../FlashMessageContext'

interface Props {
  serviceName: string
  children: ReactNode
}

const Layout = ({ serviceName, children }: Props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [modalFlashMessage, setModalFlashMessage] = useState<string>('')

  return (
    <>
      <HeaderComponent
        serviceName={serviceName}
        toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />

      <main
        className={cx('lbh-main-wrapper', {
          'govuk-!-padding-top-0': mobileMenuOpen,
        })}
        id="main-content"
        role="main"
      >
        {mobileMenuOpen && (
          <MobileMenu onLinkClick={() => setMobileMenuOpen(false)} />
        )}

        {modalFlashMessage && (
          <ModalFlashMessage
            message={modalFlashMessage}
            onClose={() => setModalFlashMessage('')}
          />
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

export default Layout
