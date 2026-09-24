import WarningInfoBox from '../Template/WarningInfoBox'

interface Props {
  message: string
}

{
  /* Needs feature toggle */
}

export const HealthAndSafetyHazardAlert = (props: Props) => {
  const { message } = props

  if (!message) return null

  return (
    <WarningInfoBox
      header="Health & Safety hazard identified"
      text={message}
      style={{ maxWidth: 600 }}
    />
  )
}
