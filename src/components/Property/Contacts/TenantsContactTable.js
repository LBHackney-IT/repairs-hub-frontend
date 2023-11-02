import { useState } from 'react'
import ConfirmationModal from '../../ConfirmationModal'

const TenantHeading = ({ fullName, personId }) => {
  const domain = 'https://manage-my-home-development.hackney.gov.uk'

  return (
    <div className="tenantContactsTable-heading govuk-body">
      <h4>{fullName}</h4>

      <a
        className="tenantContactsTable-button"
        href={`
      ${domain}/person/${personId}/edit-contact-details
      `}
        target="_blank"
      >
        Edit contact details
      </a>
    </div>
  )
}

const TenantPhoneNumber = ({ phoneNumber, fullName }) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showMainContactModal, setShowMainContactModal] = useState(false)

  return (
    <li className="tenantContactsTable-phoneNumberGrid govuk-body">
      <div className="tenantContactsTable-valueGroup">
        <h4 className="tenantContactsTable-phoneSubType">
          {phoneNumber.subType}
        </h4>
        <div className="tenantContactsTable-phone">{phoneNumber.value}</div>
      </div>
      {!!phoneNumber?.description && (
        <div className="tenantContactsTable-description">
          {phoneNumber.description}
        </div>
      )}
      <div className="tenantContactsTable-buttonGroup">
        <button
          type="button"
          className="tenantContactsTable-button"
          onClick={() => setShowMainContactModal(true)}
        >
          Set as main contact
        </button>

        <button
          type="button"
          className="tenantContactsTable-button"
          onClick={() => setShowRemoveModal(true)}
        >
          Remove
        </button>
      </div>

      <ConfirmationModal
        title={'Set as main contact'}
        showDialog={showMainContactModal}
        setShowDialog={setShowMainContactModal}
        modalText={
          <p className="govuk-body">
            Are you sure you want to change the contact type from{' '}
            <strong style={{ textTransform: 'capitalize' }}>
              {phoneNumber.subType}
            </strong>{' '}
            to{' '}
            <strong style={{ textTransform: 'capitalize' }}>
              Main contact
            </strong>
            ?
          </p>
        }
        onSubmit={() => {
          setShowMainContactModal(false)
          alert('onsubmit')
        }}
        yesButtonText={'Set as main contact'}
      />

      <ConfirmationModal
        title={'Remove contact details'}
        showDialog={showRemoveModal}
        setShowDialog={setShowRemoveModal}
        modalText={
          <p className="govuk-body">
            Are you sure you want to permanently remove{' '}
            <strong
              style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
            >
              {phoneNumber.subType}: {phoneNumber.value}
            </strong>{' '}
            from {fullName}?
          </p>
        }
        onSubmit={() => {
          setShowRemoveModal(false)
          alert('onsubmit')
        }}
        yesButtonText={'Remove phone number'}
      />
    </li>
  )
}

const TenantPhoneNumberList = ({ phoneNumbers, fullName }) => {
  return (
    <ul>
      {phoneNumbers.map((x) => (
        <TenantPhoneNumber phoneNumber={x} fullName={fullName} />
      ))}
    </ul>
  )
}

const TenantContact = ({ tenant }) => {
  return (
    <li className="tenantContactsTable-contact">
      <TenantHeading
        fullName={tenant.fullName}
        personId={'a597c0d4-e182-2db8-8003-bc6486356414'}
      />

      <hr />

      {tenant.phoneNumbers.length === 0 && <p>No contact details</p>}

      <TenantPhoneNumberList
        phoneNumbers={tenant.phoneNumbers}
        fullName={tenant.fullName}
      />
    </li>
  )
}

const TenantContactsTable = ({ tenants }) => {
  return (
    <div className="tenantContactsTable">
      <ul>
        {tenants.map((x) => (
          <TenantContact tenant={x} />
        ))}
      </ul>
    </div>
  )
}

export default TenantContactsTable
