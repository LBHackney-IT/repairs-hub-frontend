const TenantHeading = ({ fullName, personId }) => {
  const domain = "https://manage-my-home-development.hackney.gov.uk"

  return (
    <div className="tenantContactsTable-heading govuk-body">
      <h4>{fullName}</h4>

      <a className="tenantContactsTable-button" 
      href={`
      ${domain}/person/${personId}/edit-contact-details
      `}
      
      target="_blank"
      >Edit contact details</a>
    </div>
  )
}


const TenantPhoneNumber = ({ phoneNumber }) => {
  return (
    <li className="tenantContactsTable-phoneNumberGrid govuk-body">
      <div className="tenantContactsTable-valueGroup">
        <h4 className="tenantContactsTable-phoneSubType">
          {phoneNumber.subType}
        </h4>
        <div className="tenantContactsTable-phone">{phoneNumber.value}</div>
      </div>
      {!!phoneNumber?.description && (
        <div className="tenantContactsTable-description">
          {phoneNumber.description}
        </div>
      )}
      <div className="tenantContactsTable-buttonGroup">
        <button className="tenantContactsTable-button">
          Set as main contact
        </button>

        <button className="tenantContactsTable-button">Remove</button>
      </div>
    </li>
  )
}

const TenantPhoneNumberList = ({ phoneNumbers }) => {
  return (
    <ul>
      {phoneNumbers.map((x) => (
        <TenantPhoneNumber phoneNumber={x} />
      ))}
    </ul>
  )
}

const TenantContact = ({ tenant }) => {
  return (
    <li className="tenantContactsTable-contact">
      <TenantHeading fullName={tenant.fullName} personId={"a597c0d4-e182-2db8-8003-bc6486356414"} />

      <hr />

      {tenant.phoneNumbers.length === 0 && <p>No contact details</p>}

      <TenantPhoneNumberList phoneNumbers={tenant.phoneNumbers} />
    </li>
  )
}

const TenantContactsTable = ({ tenants }) => {
  return (
    <div className="tenantContactsTable">
      <ul>
      {tenants.map((x) => (
          <TenantContact tenant={x} />
          ))}
          </ul>
    </div>
  )
}

export default TenantContactsTable
