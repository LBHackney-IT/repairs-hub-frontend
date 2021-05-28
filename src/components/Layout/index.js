import HeaderComponent from './Header/Header'

const Layout = ({ children }) => (
  <>
    <HeaderComponent serviceName="Repairs Hub" />

    <main
      className="lbh-main-wrapper repairs-hub-main-wrapper"
      id="main-content"
      role="main"
    >
      <div className="lbh-container">{children}</div>
    </main>
  </>
)

export default Layout
