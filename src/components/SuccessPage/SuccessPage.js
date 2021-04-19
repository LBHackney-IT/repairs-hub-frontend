import PropTypes from 'prop-types'
import Link from 'next/link'

const SuccessPage = ({ workOrderReference, text }) => {
  return (
    <div>
      <section className="lbh-page-announcement">
        <div className="lbh-announcement__content">
          <p>
            {text} <strong>work order {workOrderReference}</strong>
          </p>
        </div>
      </section>

      <ul className="lbh-list lbh-!-margin-top-9">
        <li>
          <Link href={`/work-orders/${workOrderReference}`}>
            <a>
              <strong>View work order</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href="/">
            <a>
              <strong>Back to dashboard</strong>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

SuccessPage.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

export default SuccessPage
