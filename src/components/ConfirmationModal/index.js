import { Dialog } from '@reach/dialog'
import Spinner from '../Spinner'

const ConfirmationModal = ({
  title,
  showDialog,
  setShowDialog,
  modalText,
  onSubmit,
  yesButtonText = 'Confirm',
  noButtonText = 'Cancel',
  isLoading = false,
  modalError,
}) => {
  return (
    <Dialog
      isOpen={showDialog}
      onDismiss={() => setShowDialog(false)}
      aria-label={title}
      className="lbh-dialog"
      style={{ border: 'none' }}
      data-test="confirmation-modal"
    >
      <h2 className="lbh-heading-h2 lbh-dialog__title">{title}</h2>
      <p className="lbh-body-s">{modalText}</p>

      {modalError && !isLoading && (
        <p className="govuk-error-message lbh-error-message">{modalError}</p>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="lbh-dialog__actions">
          <button
            type="button"
            className="govuk-button lbh-button"
            onClick={onSubmit}
            data-test="confirm-button"
            aria-disabled={isLoading}
            disabled={isLoading}
          >
            <span> {yesButtonText}</span>
          </button>

          <button
            onClick={() => setShowDialog(false)}
            className="lbh-link lbh-link--no-visited-state"
            data-test="cancel-button"
            type="button"
          >
            {noButtonText}
          </button>
        </div>
      )}
    </Dialog>
  )
}

export default ConfirmationModal
