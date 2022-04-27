import BackButton from '../../Layout/BackButton'
import { TextArea, PrimarySubmitButton } from '../../Form'
import { useForm } from 'react-hook-form'

const AddMultipleSORs = () => {
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = () => {}
  return (
    <>
      <BackButton />
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
        <PrimarySubmitButton label="Continue" />
      </form>
    </>
  )
}

export default AddMultipleSORs
