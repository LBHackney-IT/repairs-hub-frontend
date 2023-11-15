import { useMemo } from 'react'
import TenantHeading from './TenantHeading'
import TenantPhoneNumber from './TenantPhoneNumber'

const TenanctContact = ({ tenant, reloadContacts }) => {
  const { phoneNumbers } = tenant

  const sortedPhoneNumbers = useMemo(
    () =>
      [...phoneNumbers].sort((a, b) => {
        if (a.subType === 'mainNumber') return -1
        if (b.subType === 'mainNumber') return 1

        // sort alphabetically by subType for consistency
        return a.subType.localeCompare(b.subType)
      }),
    [phoneNumbers]
  )

  return (
    <div className="tenantContactsTable-contact">
      <TenantHeading fullName={tenant.fullName} personId={tenant.personId} />

      <hr />

      {!sortedPhoneNumbers.length && (
        <p className="govuk-body-s" style={{ marginTop: '15px' }}>
          No contact details
        </p>
      )}

      {sortedPhoneNumbers.length >= 1 && (
        <ul>
          {sortedPhoneNumbers.map((phoneNumber, index) => (
            <TenantPhoneNumber
              key={index}
              phoneNumber={phoneNumber}
              tenant={tenant}
              reloadContacts={reloadContacts}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default TenanctContact
