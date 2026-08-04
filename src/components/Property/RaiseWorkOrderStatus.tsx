import Link from 'next/link'
import WarningText from '../Template/WarningText'

interface Props {
  canRaiseRepair: boolean
  description: string
  propertyReference: string
}

const RaiseWorkOrderStatus = (props: Props) => {
  const { canRaiseRepair, description, propertyReference } = props

  if (!canRaiseRepair) {
    return (
      <WarningText text="Cannot raise a work order on this property due to tenure type" />
    )
  }

  return (
    <span className="lbh-heading-h3 text-green">
      <Link
        href={`/properties/${propertyReference}/raise-repair/new`}
        legacyBehavior
      >
        <a className="lbh-link">
          <strong>
            Raise a work order on this {description.toLowerCase()}
          </strong>
        </a>
      </Link>
    </span>
  )
}

export default RaiseWorkOrderStatus
