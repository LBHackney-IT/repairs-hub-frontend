import PropTypes from 'prop-types'

const TmoName = ({ tmoName }) => (
  <>{tmoName && <li className="bg-orange">TMO: {tmoName}</li>}</>
)

TmoName.propTypes = {
  tmoName: PropTypes.string,
}

export default TmoName
