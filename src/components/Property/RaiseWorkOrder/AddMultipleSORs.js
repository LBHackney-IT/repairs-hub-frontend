import { TextArea, PrimarySubmitButton } from '../../Form'
import { useForm } from 'react-hook-form'

const AddMultipleSORs = ({ setCurrentPage }) => {
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = () => {}
  const FORM_PAGE = 1
  return (
    <>
      <a
        className="govuk-back-link lbh-back-link govuk-!-display-none-print"
        role="button"
        onClick={() => setCurrentPage(FORM_PAGE)}
      >
        Back
      </a>
      <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
        Add multiple SOR codes
      </h1>
      <form
        role="form"
        id="adding-multiple-sors-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextArea
          name="note"
          label="Enter SOR codes as a list:"
          register={register({
            required: 'Please add notes',
          })}
          error={errors && errors.note}
        />
        <PrimarySubmitButton label="Submit" />
      </form>
    </>
  )
}

export default AddMultipleSORs
