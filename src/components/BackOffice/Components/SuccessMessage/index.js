const SuccessMessage = ({ title }) => {
  return (
    <div className="govuk-panel govuk-panel--confirmation lbh-panel">
      <h1 className="govuk-panel__title govuk-!-margin-bottom-1">
        {title}
      </h1>
    </div>
  )
}

export default SuccessMessage
