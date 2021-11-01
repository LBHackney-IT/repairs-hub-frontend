import PropTypes from 'prop-types'
import Link from 'next/link'

const OperativeList = ({ operatives, workOrderReference }) => {
  return (
    <>
      <h4 className="lbh-heading-h4">Operatives</h4>
      <ol className="govuk-list govuk-!-margin-top-6 govuk-!-margin-bottom-9">
        {operatives.map((operative, index) => {
          const percentageDisplay = operative.jobPercentage
            ? `${operative.jobPercentage}%`
            : 'N/A'
          return process.env.NEXT_PUBLIC_OPERATIVE_MANAGEMENT_MOBILE_ENABLED ===
            'true' ? (
            <li key={index}>
              <Link href={`/work-orders/${workOrderReference}/operatives/new`}>
                <a className="govuk-link">
                  {' '}
                  {[operative.name, percentageDisplay].join(' - ')}
                </a>
              </Link>
            </li>
          ) : (
            <li key={index}>
              {[operative.name, percentageDisplay].join(' - ')}
            </li>
          )
        })}
      </ol>
    </>
  )
}

OperativeList.propTypes = {
  operatives: PropTypes.array,
}

export default OperativeList
