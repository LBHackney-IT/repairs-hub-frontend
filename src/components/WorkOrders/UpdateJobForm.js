import PropTypes from 'prop-types'
import { PrimarySubmitButton } from '../Form'
import { useForm } from 'react-hook-form'
import OriginalRateScheduleItems from './RateScheduleItems/OriginalRateScheduleItems'
import ExistingRateScheduleItems from './RateScheduleItems/ExistingRateScheduleItems'
import VariedRateScheduleItems from './RateScheduleItems/VariedRateScheduleItems'

const UpdateJobForm = ({
  tasks,
  propertyReference,
  onGetToSummary,
  addedTasks,
}) => {
  const { register, handleSubmit, errors } = useForm()
  const isContractorUpdatePage = true
  const originalTasks = tasks.filter((t) => t.original)

  return (
    <>
      <form
        role="form"
        id="repair-request-form"
        onSubmit={handleSubmit(onGetToSummary)}
      >
        <OriginalRateScheduleItems originalTasks={originalTasks} />
        <ExistingRateScheduleItems
          tasks={tasks}
          register={register}
          errors={errors}
        />
        <VariedRateScheduleItems
          register={register}
          errors={errors}
          addedTasks={addedTasks}
          isContractorUpdatePage={isContractorUpdatePage}
          propertyReference={propertyReference}
        />
        <PrimarySubmitButton label="Next" />
      </form>
    </>
  )
}

UpdateJobForm.propTypes = {
  tasks: PropTypes.array.isRequired,
  propertyReference: PropTypes.string.isRequired,
  onGetToSummary: PropTypes.func.isRequired,
  addedTasks: PropTypes.array.isRequired,
}

export default UpdateJobForm
