import TextInput from '../TextInput'

interface Props {
  min?: number
  max?: number
  step?: number
  [key: string]: unknown
}

const NumberInput = ({ min, max, step, ...props }: Props) => (
  <TextInput {...props} type="number" min={min} max={max} step={step} />
)

export default NumberInput
