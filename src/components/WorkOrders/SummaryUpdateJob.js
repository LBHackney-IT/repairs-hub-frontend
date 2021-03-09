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
  variationReason,
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

        <div className="variation-reason-summary govuk-body-s govuk-!-margin-bottom-7">
          <p className="govuk-heading-s">Variation reason</p>
          <p>{variationReason}</p>
        </div>

        <PrimarySubmitButton label="Confirm and close" />
      </form>
    </div>
  )
}

SummaryUpdateJob.propTypes = {
  reference: PropTypes.string.isRequired,
  onJobSubmit: PropTypes.func.isRequired,
  originalTasks: PropTypes.array.isRequired,
  tasks: PropTypes.array.isRequired,
  addedTasks: PropTypes.array,
  changeStep: PropTypes.func.isRequired,
  variationReason: PropTypes.string.isRequired,
}

export default SummaryUpdateJob
