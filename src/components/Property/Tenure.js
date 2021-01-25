import PropTypes from 'prop-types'

const Tenure = ({ tenure, canRaiseRepair }) => {
  let tenureToShow = (tenure) => {
    if (tenure.typeDescription) {
      return (
        <li className={`bg-${canRaiseRepair ? 'turquoise' : 'orange'}`}>
          Tenure: {tenure.typeDescription}
        </li>
      )
    } else {
      return ''
    }
  }
  return <>{tenureToShow(tenure)}</>
}

Tenure.propTypes = {
  canRaiseRepair: PropTypes.bool.isRequired,
  tenure: PropTypes.object.isRequired,
}

export default Tenure
