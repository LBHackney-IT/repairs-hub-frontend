import Spinner from '../Spinner'

interface Props {
  label: string
}

const SpinnerWithLabel = (props: Props) => {
  const { label } = props

  return (
    <div
      className="govuk-body"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Spinner />
      <span style={{ margin: '0 0 0 15px' }}>{label}</span>
    </div>
  )
}

export default SpinnerWithLabel
