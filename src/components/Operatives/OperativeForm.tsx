import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'
import BackButton from '../Layout/BackButton'
import SelectOperatives from './SelectOperatives'
import { Operative } from '../../models/operativeModel'

interface Props {
  onSubmit: (e: any) => void
  totalSMV: number
  assignedOperativesToWorkOrder: Operative[]
  availableOperatives: Operative[]
  currentUserPayrollNumber: string
  selectedPercentagesToShowOnEdit: any[]
}

const OperativeForm = (props: Props) => {
  const {
    onSubmit,
    assignedOperativesToWorkOrder,
    availableOperatives,
    selectedPercentagesToShowOnEdit,
    totalSMV,
    currentUserPayrollNumber,
  } = props

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
            currentUserPayrollNumber={currentUserPayrollNumber}
            jobIsSplitByOperative={undefined}
          />

          <PrimarySubmitButton
            id="submit-work-order-operative-add"
            label={'Confirm'}
          />
        </form>
      </div>
    </>
  )
}

export default OperativeForm
