import PropTypes from 'prop-types'

const TmoName = ({ tmoName }) => {
  let tmoToShow = (tmoName) => {
    if (tmoName) {
      return <li className="bg-orange">TMO: {tmoName}</li>
    } else {
      return ''
    }
  }
  return <>{tmoToShow(tmoName)}</>
}

TmoName.propTypes = {
  tmoName: PropTypes.string.isRequired,
}

export default TmoName
