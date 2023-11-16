import { useState } from 'react'
import RemoveContactModal from './modals/RemoveContactModal'
import SetAsMainModal from './modals/SetAsMainModal'
import classNames from 'classnames'
import { formatCamelCaseStringIntoTitleCase } from '../../../../utils/helpers/formatCamelCaseStringIntoTitleCase'

const TenantPhoneNumber = ({ phoneNumber, tenant, reloadContacts }) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showMainContactModal, setShowMainContactModal] = useState(false)

  const isMainNumber = phoneNumber.subType === 'mainNumber'

  return (
    <li className="tenantContactsTable-phoneNumberGrid govuk-body">
      <div className="tenantContactsTable-valueGroup">
        <h4 className="tenantContactsTable-phoneSubType">
          {formatCamelCaseStringIntoTitleCase(phoneNumber.subType)}
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
          className={classNames('tenantContactsTable-button', {
            disabled: isMainNumber,
          })}
          onClick={() => setShowMainContactModal(true)}
          disabled={isMainNumber}
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
        reloadContacts={reloadContacts}
      />

      <RemoveContactModal
        showModal={showRemoveModal}
        setShowModal={setShowRemoveModal}
        phoneNumber={phoneNumber}
        tenant={tenant}
        reloadContacts={reloadContacts}
      />
    </li>
  )
}

export default TenantPhoneNumber
