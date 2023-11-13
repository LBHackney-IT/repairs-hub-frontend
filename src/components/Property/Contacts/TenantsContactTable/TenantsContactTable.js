import TenantHeading from './TenantHeading'
import TenantPhoneNumber from './TenantPhoneNumber'

const TenantContactsTable = ({ tenants, reloadContacts }) => {
  if (!tenants.length) {
    return (
      <p className="govuk-body-s" style={{ marginTop: '15px' }}>
        No tenants
      </p>
    )
  }

  return (
    <div className="tenantContactsTable">
      <ul>
        {tenants.map((tenant) => (
          <li className="tenantContactsTable-contact">
            <TenantHeading
              fullName={tenant.fullName}
              personId={tenant.personId}
            />

            <hr />

            {!tenant.phoneNumbers.length && (
              <p className="govuk-body-s" style={{ marginTop: '15px' }}>
                No contact details
              </p>
            )}

            {tenant.phoneNumbers.length >= 1 && (
              <ul>
                {tenant.phoneNumbers.map((phoneNumber) => (
                  <TenantPhoneNumber
                    phoneNumber={phoneNumber}
                    tenant={tenant}
                    reloadContacts={reloadContacts}
                  />
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TenantContactsTable
