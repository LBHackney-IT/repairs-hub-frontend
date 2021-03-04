import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'
import UpdateSummaryRateScheduleItems from './RateScheduleItems/UpdateSummaryRateScheduleItems'

const SummaryUpdateJob = ({
  reference,
  onJobSubmit,
  originalTasks,
  tasks,
  addedTasks,
  changeStep,
}) => {
  const { handleSubmit } = useForm({})

  return (
    <div>
      <h1 className="govuk-heading-l">Update work order: {reference}</h1>
      <form
        role="form"
        id="repair-request-form"
        onSubmit={handleSubmit(onJobSubmit)}
      >
        <p className="govuk-heading-s">Summary of updates to work order</p>

        <UpdateSummaryRateScheduleItems
          originalTasks={originalTasks}
          tasks={tasks}
          addedTasks={addedTasks}
          changeStep={changeStep}
        />

        <PrimarySubmitButton label="Confirm and close" />
      </form>
    </div>
  )
}

SummaryUpdateJob.propTypes = {
  reference: PropTypes.string.isRequired,
  onJobSubmit: PropTypes.func.isRequired,
  addedTasks: PropTypes.array,
  changeStep: PropTypes.func.isRequired,
}

export default SummaryUpdateJob
