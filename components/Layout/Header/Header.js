import { Header } from 'lbh-frontend-react'

const HeaderComponent = ({ serviceName }) => (
  <div>
    <Header
      serviceName={serviceName} isServiceNameShort={false} homepageUrl="/"
    />
  </div>
);

export default HeaderComponent
