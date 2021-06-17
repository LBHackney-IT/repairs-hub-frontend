import PropTypes from 'prop-types'

const Tenure = ({ tenure, canRaiseRepair }) => (
  <>
    {tenure.typeDescription && (
      <li className={`bg-${canRaiseRepair ? 'dark-green' : 'orange'}`}>
        Tenure: {tenure.typeDescription}
      </li>
    )}
  </>
)

Tenure.propTypes = {
  canRaiseRepair: PropTypes.bool.isRequired,
  tenure: PropTypes.shape({
    typeCode: PropTypes.string,
    typeDescription: PropTypes.string,
  }).isRequired,
}

export default Tenure
