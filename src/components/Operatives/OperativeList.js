import PropTypes from 'prop-types'
import Link from 'next/link'

const OperativeList = ({ operatives, workOrderReference }) => {
  return (
    <>
      <h4 className="lbh-heading-h4">Operatives</h4>
      <dl class="govuk-summary-list govuk-summary-list--no-border lbh-summary-list govuk-!-margin-top-6 govuk-!-margin-bottom-9">
        <div class="govuk-summary-list__row">
          <dd class="govuk-summary-list__value">
            {operatives.map((operative) => {
              const percentageDisplay = operative.jobPercentage
                ? `${operative.jobPercentage}%`
                : 'N/A'
              return (
                <>
                  <Link
                    href={`/work-orders/${workOrderReference}/operatives/new`}
                  >
                    <a className="govuk-link">
                      {[operative.name, percentageDisplay].join(' - ')}
                    </a>
                  </Link>
                  <br />
                  <br />
                </>
              )
            })}
          </dd>
        </div>
      </dl>
    </>
  )
}

OperativeList.propTypes = {
  operatives: PropTypes.array,
}

export default OperativeList
