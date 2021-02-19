const ContactsNoneAvailable = () => {
  return (
    <div className="govuk-warning-text">
      <span className="govuk-warning-text__icon" aria-hidden="true">
        !
      </span>
      <strong className="govuk-warning-text__text">
        <span className="govuk-warning-text__assistive">Warning</span>
        No contact details available for this property
      </strong>
    </div>
  )
}

export default ContactsNoneAvailable
