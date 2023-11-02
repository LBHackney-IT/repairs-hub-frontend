import TenantHeading from './TenantHeading'
import TenantPhoneNumberList from './TenantPhoneNumberList'

const TenantContact = ({ tenant }) => {
  return (
    <li className="tenantContactsTable-contact">
      <TenantHeading
        fullName={tenant.fullName}
        personId={tenant.personId}
      />

      <hr />

      {tenant.phoneNumbers.length === 0 && <p>No contact details</p>}

      <TenantPhoneNumberList
        phoneNumbers={tenant.phoneNumbers}
        fullName={tenant.fullName}
        personId={tenant.personId}
      />
    </li>
  )
}

export default TenantContact