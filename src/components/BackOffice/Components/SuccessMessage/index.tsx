interface Props {
  title: string
  resetFormText: string
  resetFormCallback: () => void
}

const SuccessMessage = ({ title, resetFormText, resetFormCallback }: Props) => {
  return (
    <>
      <div className="govuk-panel govuk-panel--confirmation lbh-panel">
        <h1 className="govuk-panel__title govuk-!-margin-bottom-1">{title}</h1>
      </div>

      <p>
        <button
          data-test="successMessageContinue"
          className="lbh-link"
          role="button"
          onClick={resetFormCallback}
        >
          {resetFormText}
        </button>
      </p>
    </>
  )
}

export default SuccessMessage
