import Tabs from '..'
import { TabName } from '../tabNames'

const tabsList: TabName[] = [TabName.WorkOrderHistory]

interface Props {
  propertyReference: string
}

const PropertyViewTabs = (props: Props) => {
  const { propertyReference } = props

  return <Tabs tabsList={tabsList} propertyReference={propertyReference} />
}

export default PropertyViewTabs
