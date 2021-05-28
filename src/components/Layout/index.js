import HeaderComponent from './Header/Header'

const Layout = ({ children }) => (
  <div>
    <HeaderComponent serviceName="Repairs Hub" />

    <div className="govuk-width-container">
      <main
        className="govuk-main-wrapper repairs-hub-main-wrapper"
        id="main-content"
        role="main"
      >
        {children}
      </main>
    </div>
  </div>
)

export default Layout
