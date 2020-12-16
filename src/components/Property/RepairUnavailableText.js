const RepairUnavailableText = () => (
  <div className="govuk-warning-text">
    <span className="govuk-warning-text__icon" aria-hidden="true">
      !
    </span>
    <strong className="govuk-warning-text__text">
      <span className="govuk-warning-text__assistive">Warning</span>
      Cannot raise a repair on this property due to tenancy status
    </strong>
  </div>
)

export default RepairUnavailableText
