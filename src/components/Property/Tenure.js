import PropTypes from 'prop-types'

const Tenure = ({ tenure }) => {
  let tenureToShow = (tenure) => {
    if (tenure?.typeCode) {
      return (
        <li className={`bg-${tenure.canRaiseRepair ? 'turquoise' : 'orange'}`}>
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
  tenure: PropTypes.object.isRequired,
}

export default Tenure
