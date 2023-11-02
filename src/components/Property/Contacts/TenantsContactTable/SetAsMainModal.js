import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import ConfirmationModal from '../../../ConfirmationModal'
import { useState } from 'react'

const SetAsMainModal = ({
  showModal,
  setShowModal,
  phoneNumber,
  tenant
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [modalError, setModalError] = useState(null)

  const handleOnSubmit = () => {
    setIsLoading(true)
    setModalError(null)

    const body = {
      contactInformation: {
        subType: "mainNumber"
      }
    }

    const path = `/api/contact-details/?contactId=${phoneNumber.contactId}&personId=${tenant.personId}`

    frontEndApiRequest({
      method: 'PATCH',
      path,
      requestData: body
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
      })
  }

  return (
    <ConfirmationModal
        title={'Set as main contact'}
        showDialog={showModal}
        setShowDialog={setShowModal}
        isLoading={isLoading}
        modalError={modalError}
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
        onSubmit={handleOnSubmit}
        yesButtonText={'Set as main contact'}
      />
  )
}

export default SetAsMainModal
