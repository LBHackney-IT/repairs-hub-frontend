import BackButton from '../../Layout/BackButton'

const Layout = ({ children, title }) => {
  return (
    <>
      <BackButton />

      <h1 className="lbh-heading-h1">{title}</h1>
      <>{children}</>
    </>
  )
}

export default Layout
