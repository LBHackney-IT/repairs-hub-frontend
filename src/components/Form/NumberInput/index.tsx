import TextInput from '../TextInput'

interface Props {
  name: string
  min?: number
  max?: number
  step?: number
  [key: string]: any
}

const NumberInput = ({ min, max, step, ...props }: Props) => (
  <TextInput {...props} type="number" min={min} max={max} step={step} />
)

export default NumberInput
