import PropTypes from 'prop-types'
import Radios from '../Form/Radios/Radios'
import BackButton from '../Layout/BackButton/BackButton'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'
import { useRouter } from 'next/router'

const ChooseOption = ({ reference }) => {
  const router = useRouter()

  const { handleSubmit, register, errors } = useForm({
    mode: 'onChange',
  })

  const onSubmitForm = (e) => {
    if (e.options == 'Close job') {
      router.push({
        pathname: 'close-job',
        query: { id: reference },
      })
    } else if (e.options == 'Update') {
      router.push({
        pathname: 'update-job',
        query: { id: reference },
      })
    }
  }

  return (
    <>
      <BackButton />
      <h1 className="govuk-heading-l">Update work order: {reference}</h1>
      <form role="form" onSubmit={handleSubmit(onSubmitForm)}>
        <Radios
          label="Select process"
          name="options"
          options={['Update', 'Close job']}
          register={register({
            required: 'Please select a process',
          })}
          error={errors && errors.options}
        />
        <PrimarySubmitButton label="Next" />
      </form>
    </>
  )
}
ChooseOption.propTypes = {
  reference: PropTypes.string.isRequired,
}

export default ChooseOption
