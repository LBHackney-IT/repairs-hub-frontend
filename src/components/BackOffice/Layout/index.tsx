import BackButton from '../../Layout/BackButton'

interface Props {
  children: any,
  title: string
}

const Layout = ({ children, title }: Props) => {
  return (
    <>
      <BackButton />

      <h1 className="lbh-heading-h1">{title}</h1>
      <>{children}</>
    </>
  )
}

export default Layout
