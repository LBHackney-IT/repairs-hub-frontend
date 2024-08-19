const TenantHeading = ({ fullName, personId }) => {
  const MMH_FRONTEND_URL = process.env.NEXT_PUBLIC_MMH_FRONTEND_URL
  const editPageUrl = `${MMH_FRONTEND_URL}person/${personId}/edit-contact-details`

  return (
    <div className="tenantContactsTable-heading govuk-body">
      <h4>{fullName}</h4>

      <a
        className="tenantContactsTable-button"
        href={editPageUrl}
        target="_blank"
        style={{ fontSize: 16 }}
        rel="noreferrer"
      >
        Edit contact details
      </a>
    </div>
  )
}

export default TenantHeading
