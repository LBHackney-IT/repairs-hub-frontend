import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import ConfirmationModal from '../../../../ConfirmationModal'
import { useState, useEffect } from 'react'

const RemoveContactModal = ({
  showModal,
  setShowModal,
  phoneNumber,
  tenant,
  reloadContacts,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [modalError, setModalError] = useState(null)

  useEffect(() => {
    // Reset on reopen modal
    setModalError(null)
  }, [showModal])

  const handleOnSubmit = () => {
    const path = `/api/contact-details/?contactId=${phoneNumber.contactId}&personId=${tenant.personId}`

    setIsLoading(true)
    setModalError(null)
    frontEndApiRequest({
      method: 'delete',
      path,
    })
      .then((res) => {
        console.log({ res })

        setShowModal(false)
      })
      .catch((err) => {
        console.log({ err })
        setModalError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
        reloadContacts()
      })
  }

  return (
    <ConfirmationModal
      title={'Remove contact details'}
      showDialog={showModal}
      setShowDialog={setShowModal}
      isLoading={isLoading}
      modalError={modalError}
      modalText={
        <p className="govuk-body">
          Are you sure you want to remove{' '}
          <strong style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
            {phoneNumber.subType}: {phoneNumber.value}
          </strong>{' '}
          from {tenant.fullName}?
        </p>
      }
      onSubmit={handleOnSubmit}
      yesButtonText={'Remove phone number'}
    />
  )
}

export default RemoveContactModal
