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
          <li key={index}>
            <TenanctContact tenant={tenant} reloadContacts={reloadContacts} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TenantContactsTable
