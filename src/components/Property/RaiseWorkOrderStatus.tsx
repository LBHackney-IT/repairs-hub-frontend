import Link from 'next/link'
import WarningText from '../Template/WarningText'
import RaiseWorkOrderLink from './RaiseWorkOrderLink'

const REPAIRS_FINDER_ENABLED =
  process.env.NEXT_PUBLIC_REPAIRS_FINDER_INTEGRATION_ENABLED === 'true'

interface Props {
  canRaiseRepair: boolean
  description: string
  propertyReference: string
}

const RaiseWorkOrderStatus = ({
  canRaiseRepair,
  description,
  propertyReference,
}: Props) => {
  const repairsFinderLinks = [
    {
      title: 'Raise work order with Repairs Finder',
      description:
        'Use our diagnostics tool to identify and raise a work order',
      path: `/properties/${propertyReference}/raise-repair/repairs-finder`,
    },
    {
      title: 'Raise a standard work order',
      description: 'Raise a work order using the standard form',
      path: `/properties/${propertyReference}/raise-repair/new`,
    },
  ]

  if (!canRaiseRepair) {
    return (
      <WarningText text="Cannot raise a work order on this property due to tenure type" />
    )
  }

  if (!REPAIRS_FINDER_ENABLED) {
    return (
      <span className="lbh-heading-h3 text-green">
        <Link href={`/properties/${propertyReference}/raise-repair/new`}>
          <a className="lbh-link">
            <strong>
              Raise a work order on this {description.toLowerCase()}
            </strong>
          </a>
        </Link>
      </span>
    )
  }

  return (
    <>
      {repairsFinderLinks.map((x, index) => {
        return (
          <RaiseWorkOrderLink
            key={index}
            title={x.title}
            description={x.description}
            url={x.path}
          />
        )
      })}
    </>
  )
}

export default RaiseWorkOrderStatus
