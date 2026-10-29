const DevelopmentNote = () => {
  if (
    ['production', 'test'].includes(
      process.env.NEXT_PUBLIC_ENV_NAME?.toLowerCase()
    )
  ) {
    return null
  }

  return (
    <div className="text-for-env-note govuk-!-display-none-print govuk-!-margin-0">
      <div className="lbh-container">
        <h3>
          {`This is not live, this is ${process.env.NEXT_PUBLIC_ENV_NAME}`.toUpperCase()}
        </h3>
      </div>
    </div>
  )
}

export default DevelopmentNote
