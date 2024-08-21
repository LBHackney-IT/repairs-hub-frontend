import PropTypes from 'prop-types'
import Link from 'next/link'
import { sortOperativesWithPayrollFirst } from '@/utils/helpers/operatives'

const OperativeList = ({
  operatives,
  currentUserPayrollNumber,
  workOrderReference,
  readOnly,
}) => {
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
const OperativeListLinkItem = ({ workOrderReference, operativeDisplay }) => (
  <li>
    <Link
      href={`/work-orders/${workOrderReference}/operatives/edit`}
      legacyBehavior
    >
      <a className="govuk-link">{operativeDisplay}</a>
    </Link>
  </li>
)

const OperativeListItem = ({ operativeDisplay }) => <li>{operativeDisplay}</li>

OperativeList.propTypes = {
  operatives: PropTypes.array,
  readOnly: PropTypes.bool.isRequired,
}

export default OperativeList
