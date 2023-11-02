import TenantHeading from './TenantHeading'
import TenantPhoneNumber from './TenantPhoneNumber'

const TenantContactsTable = ({ tenants }) => {
  return (
    <div className="tenantContactsTable">
      <ul>
        {tenants.map((x) => (
          <li className="tenantContactsTable-contact">
            <TenantHeading fullName={x.fullName} personId={x.personId} />

            <hr />

            {x.phoneNumbers.length === 0 && <p>No contact details</p>}

            <ul>
              {phoneNumbers.map((x) => (
                <TenantPhoneNumber phoneNumber={x.phoneNumbers} tenant={x} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TenantContactsTable
