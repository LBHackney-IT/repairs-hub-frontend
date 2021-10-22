import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'
import BackButton from '../Layout/BackButton'
import SelectOperatives from './SelectOperatives'

const OperativeForm = ({
  onSubmit,
  assignedOperativesToWorkOrder,
  availableOperatives,
  selectedPercentagesToShowOnEdit,
  totalSMV,
}) => {
  const { handleSubmit, register, errors, trigger, getValues } = useForm({})

  return (
    <>
      <div>
        <BackButton />

        <h2 className="lbh-heading-h2">Add operative</h2>

        <form role="form" onSubmit={handleSubmit(onSubmit)}>
          <SelectOperatives
            assignedOperativesToWorkOrder={assignedOperativesToWorkOrder}
            availableOperatives={availableOperatives}
            register={register}
            errors={errors}
            selectedPercentagesToShowOnEdit={selectedPercentagesToShowOnEdit}
            trigger={trigger}
            getValues={getValues}
            totalSMV={totalSMV}
          />

          <PrimarySubmitButton label={'Confirm'} />
        </form>
      </div>
    </>
  )
}

OperativeForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  totalSMV: PropTypes.number.isRequired,
}

export default OperativeForm
