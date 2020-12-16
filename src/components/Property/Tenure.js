import PropTypes from 'prop-types'

const Tenure = ({ tenure }) => {
  let tenureToShow = (tenure) => {
    if (tenure) {
      return (
        <ul className="govuk-tag bg-turquoise">
          <li>Tenure: {tenure.typeDescription}</li>
        </ul>
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
