import Spinner from '../Spinner'

interface Props {
  label: string
  resource?: string
}

const SpinnerWithLabel = (props: Props) => {
  const { label, resource } = props

  return (
    <div
      className="govuk-body"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Spinner resource={resource} />
      <span style={{ margin: '0 0 0 15px', color: '#505a5f' }}>{label}</span>
    </div>
  )
}

export default SpinnerWithLabel
