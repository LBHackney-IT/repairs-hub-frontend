import TenantHeading from './TenantHeading'
import TenantPhoneNumber from './TenantPhoneNumber'

const TenantContactsTable = ({ tenants, reloadContacts }) => {
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

            {tenant.phoneNumbers.length === 0 && <p>No contact details</p>}

            <ul>
              {tenant.phoneNumbers.map((phoneNumber) => (
                <TenantPhoneNumber
                  phoneNumber={phoneNumber}
                  tenant={tenant}
                  reloadContacts={reloadContacts}
                />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TenantContactsTable
