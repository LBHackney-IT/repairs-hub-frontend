import TenantPhoneNumber from "./TenantPhoneNumber"

const TenantPhoneNumberList = ({ phoneNumbers, fullName, personId }) => {
  return (
    <ul>
      {phoneNumbers.map((x) => (
        <TenantPhoneNumber phoneNumber={x} fullName={fullName} personId={personId} />
      ))}
    </ul>
  )
}

export default TenantPhoneNumberList