import PropTypes from 'prop-types'
import Link from 'next/link'

const OperativeList = ({ operatives, workOrderReference }) => {
  return (
    <>
      <h1 className="lbh-heading-h3">Operatives</h1>
      <dl class="govuk-summary-list govuk-summary-list--no-border lbh-summary-list">
        <div class="govuk-summary-list__row">
          <dd class="govuk-summary-list__value">
            {operatives.map((operative, index) => (
              <>
                <Link
                  href={`/work-orders/${workOrderReference}/operatives/edit`}
                  index={index}
                >
                  <a class="govuk-body govuk-link">
                    {operative.payrollNumber} {operative.name}
                    {operative.jobPercentage
                      ? `- ${operative.jobPercentage}`
                      : ''}
                  </a>
                </Link>
                <br />
              </>
            ))}
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
