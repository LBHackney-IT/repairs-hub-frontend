import TenantContact from './TenantContact'

const TenantContactsTable = ({ tenants }) => {
  return (
    <div className="tenantContactsTable">
      <ul>
        {tenants.map((x) => (
          <TenantContact tenant={x}  />
        ))}
      </ul>
    </div>
  )
}

export default TenantContactsTable
