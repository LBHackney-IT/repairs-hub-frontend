import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { GridRow, GridColumn } from '../Layout/Grid'
import BackButton from '../Layout/BackButton'
import { Button, PrimarySubmitButton } from '../Form'
import CharacterCountLimitedTextArea from '../Form/CharacterCountLimitedTextArea'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'

import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'

import {
  UpdateWorkOrderDescriptionWorkOrderDetailsProps,
  FormValues,
  WorkOrderEditDescriptionType,
} from '../../types/variations/types'

import { getWorkOrder } from '@/utils/helpers/workOrders'

const UpdateWorkOrderDescriptionWorkOrderDetails = ({
  workOrderReference,
}: UpdateWorkOrderDescriptionWorkOrderDetailsProps) => {
  const [
    workOrder,
    setWorkOrder,
  ] = useState<WorkOrderEditDescriptionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const router = useRouter()

  useEffect(() => {
    const fetchWorkOrder = async () => {
      setLoading(true)
      const { workOrder, error } = await getWorkOrder(workOrderReference)
      setWorkOrder(workOrder as WorkOrderEditDescriptionType)
      setError(error)
      setLoading(false)
    }

    fetchWorkOrder()
  }, [workOrderReference])

  const onSubmit = async (data: FormValues) => {
    try {
      await frontEndApiRequest({
        method: 'patch',
        path: `/api/workOrders/updateDescription`,
        requestData: {
          workOrderId: workOrder.reference,
          description: data.editRepairDescription,
        },
      })
      router.push(`/work-orders/${workOrder.reference}`)
    } catch (error) {
      console.log(error)
    }
  }

  const onCancel = () => {
    router.push(`/work-orders/${workOrder.reference}`)
  }

  if (loading) return <Spinner />
  if (error) return <ErrorMessage label={error} />

  return (
    <div className="govuk-!-display-none-print">
      <BackButton />
      <GridRow>
        <GridColumn width="two-thirds">
          <h1 className="lbh-heading-h1 display-inline govuk-!-margin-right-6">
            Work order: {workOrder.reference.toString().padStart(8, '0')}
          </h1>
          <form
            role="form"
            id="edit-description-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <CharacterCountLimitedTextArea
              name="editRepairDescription"
              label="Edit repair description"
              required
              maxLength={230}
              requiredText="Please enter a repair description"
              register={register}
              defaultValue={workOrder.description}
              error={errors && errors.editRepairDescription}
              currentLength={230 - workOrder.description.length}
            />
            <Button
              label="Cancel"
              type="button"
              isSecondary
              onClick={onCancel}
            />
            <PrimarySubmitButton label="Save" />
          </form>
        </GridColumn>
      </GridRow>
    </div>
  )
}

export default UpdateWorkOrderDescriptionWorkOrderDetails
