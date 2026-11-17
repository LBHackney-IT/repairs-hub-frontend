import TenanctContact, { Tenant } from './TenantContact'

interface Props {
  tenants: Tenant[]
  reloadContacts: () => void
}

const TenantContactsTable = ({ tenants, reloadContacts }: Props) => {
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
