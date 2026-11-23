import Spinner from '../Spinner'

interface Props {
  label: string
  width?: number
}

const SpinnerWithLabel = (props: Props) => {
  const { label, width } = props

  return (
    <div
      className="govuk-body"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Spinner width={width} />
      <span style={{ margin: '0 0 0 15px', color: '#505a5f' }}>{label}</span>
    </div>
  )
}

export default SpinnerWithLabel
