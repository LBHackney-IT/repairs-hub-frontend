import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { GridRow, GridColumn } from '../Layout/Grid'
import BackButton from '../Layout/BackButton'
import { Button, PrimarySubmitButton } from '../Form'
import CharacterCountLimitedTextArea from '../Form/CharacterCountLimitedTextArea'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'

import { WorkOrder } from '@/models/workOrder'

import {
  getWorkOrder,
  postNote,
  editWorkOrder,
} from '@/utils/requests/workOrders'
import { buildNoteFormData } from '../../utils/hact/jobStatusUpdate/notesForm'

export type EditWorkOrderProps = {
  workOrderReference: string
}

export type FormValues = {
  editRepairDescription: string
}

const EditWorkOrder = ({ workOrderReference }: EditWorkOrderProps) => {
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const router = useRouter()

  useEffect(() => {
    fetchWorkOrder()
  }, [workOrderReference])

  const fetchWorkOrder = async () => {
    setLoading(true)
    const { response, error } = await getWorkOrder(workOrderReference)
    setWorkOrder(response)
    setError(error)
    setLoading(false)
  }

  const onSubmit = async (data: FormValues) => {
    const noteData = buildNoteFormData({
      note: `Description updated: ${data.editRepairDescription}`,
      workOrderReference: workOrder.reference,
    })
    const editWorkOrderResponse = await editWorkOrder(
      workOrder.reference,
      data.editRepairDescription
    )
    if (!editWorkOrderResponse.success) {
      setError(editWorkOrderResponse.error)
      return
    }

    const postNoteResponse = await postNote(noteData)

    if (!postNoteResponse.success) {
      setError(postNoteResponse.error)
      return
    }
    router.push(`/work-orders/${workOrder.reference}`)
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
          <h1 className="lbh-heading-h1 display-inline ">
            {`Edit work order: ${workOrder.reference
              .toString()
              .padStart(8, '0')}`}
          </h1>
          <form
            role="form"
            id="edit-work-order-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <CharacterCountLimitedTextArea
              name="editRepairDescription"
              label="Repair description"
              required
              maxLength={230}
              requiredText="Please enter a repair description"
              register={register}
              defaultValue={workOrder.description}
              error={errors && errors.editRepairDescription}
              currentLength={230 - workOrder.description.length}
            />
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button
                label="Cancel"
                type="button"
                isSecondary
                onClick={onCancel}
              />
              <PrimarySubmitButton
                id="submit-work-order-edit"
                style={{ margin: '0' }}
                label="Save"
              />
            </div>
          </form>
        </GridColumn>
      </GridRow>
    </div>
  )
}

export default EditWorkOrder
