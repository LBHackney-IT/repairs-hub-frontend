import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { GridRow, GridColumn } from '../Layout/Grid'
import BackButton from '../Layout/BackButton'
import { Button, PrimarySubmitButton } from '../Form'
import CharacterCountLimitedTextArea from '../Form/CharacterCountLimitedTextArea'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'

import {
  EditWorkOrderDescriptionProps,
  FormValues,
} from '../../types/edit-workorder/types'

import { WorkOrder } from '@/models/workOrder'

import {
  getWorkOrder,
  postNote,
  editDescription,
} from '@/utils/requests/workOrders'
import { buildNoteFormData } from '../../utils/hact/jobStatusUpdate/notesForm'

const EditWorkOrderDescription = ({
  workOrderReference,
}: EditWorkOrderDescriptionProps) => {
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
    const editDescriptionResponse = await editDescription(
      workOrder.reference,
      data.editRepairDescription
    )
    const postNoteResponse = await postNote(noteData)

    if (!editDescriptionResponse.success)
      throw new Error('Failed to edit description')
    if (!postNoteResponse.success) throw new Error('Failed to post note')
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
            id="edit-description-form"
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
            <div className="button-group">
              <Button
                label="Cancel"
                type="button"
                isSecondary
                onClick={onCancel}
              />
              <PrimarySubmitButton className="primary-button" label="Save" />
            </div>
          </form>
        </GridColumn>
      </GridRow>
    </div>
  )
}

export default EditWorkOrderDescription
