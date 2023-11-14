import TenanctContact from './TenantContact'

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
        {tenants.map((tenant, index) => (
          <TenanctContact
            tenant={tenant}
            key={index}
            reloadContacts={reloadContacts}
          />
        ))}
      </ul>
    </div>
  )
}

export default TenantContactsTable
