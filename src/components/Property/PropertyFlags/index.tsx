import TenureComponent from '../Tenure'
import TenureDetail from '../TenureDetail'
import PropertyBoilerHouseDetails from '../PropertyBoilerHouseDetails'
import { Tenure } from '@/root/src/models/propertyTenure'

interface Props {
  canRaiseRepair: boolean
  tenure: Tenure
  tmoName?: string
  boilerHouseId?: string
}

//Properties with TMO names set to this value aren't actually TMOs
const TMO_HACKNEY_DEFAULT = 'London Borough of Hackney'

const PropertyFlags = (props: Props) => {
  const { canRaiseRepair, tenure, tmoName, boilerHouseId } = props

  const showBoilerHouseDetails = () =>
    boilerHouseId !== '' &&
    boilerHouseId !== null &&
    boilerHouseId !== undefined

  return (
    <ul
      className="lbh-list hackney-property-alerts"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '1em',
      }}
    >
      {tenure && Object.keys(tenure).length > 0 && (
        <TenureComponent tenure={tenure} canRaiseRepair={canRaiseRepair} />
      )}

      {showBoilerHouseDetails() && (
        <PropertyBoilerHouseDetails boilerHouseId={boilerHouseId} />
      )}

      {tmoName && tmoName !== TMO_HACKNEY_DEFAULT && (
        <TenureDetail text="TMO" detail={tmoName} />
      )}
    </ul>
  )
}

export default PropertyFlags
