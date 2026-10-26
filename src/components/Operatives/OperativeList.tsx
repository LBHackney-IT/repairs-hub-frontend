import Link from 'next/link'
import type { Operative } from '@/root/src/models/operativeModel'
import { sortOperativesWithPayrollFirst } from '@/utils/helpers/operatives'

interface Props {
  operatives: Operative[]
  currentUserPayrollNumber?: string
  workOrderReference: string
  readOnly: boolean
}

const OperativeList = ({
  operatives,
  currentUserPayrollNumber,
  workOrderReference,
  readOnly,
}: Props) => {
  return (
    <>
      <h4 className="lbh-heading-h4">Operatives</h4>
      <ol className="govuk-list govuk-!-margin-top-6 govuk-!-margin-bottom-9">
        {sortOperativesWithPayrollFirst(
          operatives,
          currentUserPayrollNumber
        ).map((operative, index) => {
          const percentageDisplay = operative.jobPercentage
            ? `${operative.jobPercentage}%`
            : 'N/A'
          const operativeDisplay = [operative.name, percentageDisplay].join(
            ' - '
          )
          return !readOnly ? (
            <OperativeListLinkItem
              key={index}
              workOrderReference={workOrderReference}
              operativeDisplay={operativeDisplay}
            />
          ) : (
            <OperativeListItem
              key={index}
              operativeDisplay={operativeDisplay}
            />
          )
        })}
      </ol>
    </>
  )
}
interface LinkItemProps {
  workOrderReference: string
  operativeDisplay: string
}

const OperativeListLinkItem = ({
  workOrderReference,
  operativeDisplay,
}: LinkItemProps) => (
  <li>
    <Link
      href={`/work-orders/${workOrderReference}/operatives/edit`}
      legacyBehavior
    >
      <a className="govuk-link">{operativeDisplay}</a>
    </Link>
  </li>
)

const OperativeListItem = ({
  operativeDisplay,
}: {
  operativeDisplay: string
}) => <li>{operativeDisplay}</li>

export default OperativeList
