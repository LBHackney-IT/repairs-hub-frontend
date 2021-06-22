import PropTypes from 'prop-types'

const TenureDetail = ({ text, detail }) => (
  <>
    {detail && (
      <li className="bg-orange">
        {text}: {detail}
      </li>
    )}
  </>
)

TenureDetail.propTypes = {
  detail: PropTypes.string,
  text: PropTypes.string,
}

export default TenureDetail
