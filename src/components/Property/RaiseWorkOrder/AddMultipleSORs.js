import PropTypes from 'prop-types'
import { TextArea, PrimarySubmitButton } from '../../Form'
import { useForm } from 'react-hook-form'

const AddMultipleSORs = ({ setPageBackToFormView }) => {
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = () => {}

  return (
    <>
      <a
        className="govuk-back-link lbh-back-link govuk-!-display-none-print"
        role="button"
        onClick={() => setPageBackToFormView()}
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
            required: 'Please enter SOR codes',
          })}
          error={errors && errors.note}
        />
        <PrimarySubmitButton label="Submit" />
      </form>
    </>
  )
}

AddMultipleSORs.propTypes = {
  setPageBackToFormView: PropTypes.func.isRequired,
}

export default AddMultipleSORs
