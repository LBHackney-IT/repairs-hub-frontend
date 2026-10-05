import WarningInfoBox from '../Template/WarningInfoBox'

interface Props {
  message: string
}

export const HealthAndSafetyHazardAlert = (props: Props) => {
  const { message } = props

  if (!message) return null

  return (
    <>
      <WarningInfoBox
        header="Health & Safety Hazard"
        text={
          <>
            <ul style={{ color: 'hsl(180 4% 25% / 1)', marginTop: '10px' }}>
              {message.split('\n').map((x) => (
                <li>{x}</li>
              ))}
            </ul>

            <div style={{ marginLeft: '-30px', marginTop: '20px' }}>
              Please speak to resident as part of any repair
            </div>
          </>
        }
        style={{ maxWidth: 600, whiteSpace: 'pre-line' }}
        className="variant-health-and-safety-flag"
      />
    </>
  )
}
