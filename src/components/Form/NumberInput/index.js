import PropTypes from 'prop-types'
import TextInput from '../TextInput'

const NumberInput = ({ min, max, step, ...props }) => (
  <TextInput {...props} type="number" min={min} max={max} step={step} />
)

NumberInput.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
}

export default NumberInput
