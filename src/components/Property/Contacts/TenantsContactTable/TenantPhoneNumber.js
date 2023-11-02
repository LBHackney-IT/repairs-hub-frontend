import { useState } from 'react'
import RemoveContactModal from './RemoveContactModal'
import SetAsMainModal from './SetAsMainModal'

const TenantPhoneNumber = ({ phoneNumber, tenant }) => {
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

      <SetAsMainModal
        showModal={showMainContactModal}
        setShowModal={setShowMainContactModal}
        phoneNumber={phoneNumber}
        tenant={tenant}
      />

      <RemoveContactModal
        showModal={showRemoveModal}
        setShowModal={setShowRemoveModal}
        phoneNumber={phoneNumber}
        tenant={tenant}
      />
    </li>
  )
}

export default TenantPhoneNumber
