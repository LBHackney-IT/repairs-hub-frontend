import { Property } from '@/root/src/models/propertyTenure'
import Meta from '../../../Meta'

interface Props {
  property: Property
}

const RaiseWorkOrderFormMeta = ({ property }: Props) => {
  return (
    <Meta
      {...(property &&
        property.address && {
          title: `New repair at ${property.address.addressLine}`,
        })}
    />
  )
}

export default RaiseWorkOrderFormMeta
