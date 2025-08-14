import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { GridRow, GridColumn } from '../Layout/Grid'
import BackButton from '../Layout/BackButton'
import { Button, PrimarySubmitButton } from '../Form'
import { TextInput, CharacterCountLimitedTextArea } from '../Form'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import TenantContactsTable from '../../components/Property/Contacts/TenantsContactTable/TenantsContactTable'
import ContactsTable from '../../components/Property/Contacts/ContactsTable'

import { WorkOrder } from '@/models/workOrder'

import {
  postNote,
  editWorkOrder,
  getWorkOrderDetails,
} from '@/utils/requests/workOrders'
import { buildNoteFormData } from '../../utils/hact/jobStatusUpdate/notesForm'
import {
  getPropertyTenureData,
  getContactDetails,
} from '../../utils/requests/property'

export type EditWorkOrderProps = {
  workOrderReference: string
}

export type FormValues = {
  editRepairDescription: string
  callerName: string
  contactNumber: string
}

const EditWorkOrder = ({ workOrderReference }: EditWorkOrderProps) => {
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState([])
  const [tenants, setTenants] = useState([])
  const [householdMembers, setHouseholdMembers] = useState([])
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const router = useRouter()

  useEffect(() => {
    fetchWorkOrderDetails()
  }, [workOrderReference])

  const fetchWorkOrderDetails = async () => {
    setLoading(true)
    const workOrderResponse = await getWorkOrderDetails(workOrderReference)

    if (!workOrderResponse.success) {
      setError(workOrderResponse.error.message)
      setLoading(false)
      return
    }

    setWorkOrder(workOrderResponse.response)

    const propertyDataResponse = await getPropertyTenureData(
      workOrderResponse.response.propertyReference
    )

    if (!propertyDataResponse.success) {
      setError(propertyDataResponse.error.message)
      setLoading(false)
      return
    }

    const tenure = propertyDataResponse.response.tenure

    if (tenure != null) {
      const contactDetailsResponse = await getContactDetails(tenure?.id)
      if (!contactDetailsResponse.success) {
        setError(contactDetailsResponse.error.message)
        setLoading(false)
        return
      }

      setContacts(contactDetailsResponse.response)
      setTenants(
        contactDetailsResponse.response.filter((x) => x.tenureType === 'Tenant')
      )
      setHouseholdMembers(
        contactDetailsResponse.response.filter(
          (x) => x.tenureType === 'HouseholdMember'
        )
      )
    }

    setLoading(false)
  }

  const onSubmit = async (data: FormValues) => {
    const noteData = buildNoteFormData({
      note: `Description updated: ${data.editRepairDescription}`,
      workOrderReference: workOrder.reference,
    })
    const editWorkOrderResponse = await editWorkOrder(
      workOrder.reference,
      data.editRepairDescription,
      data.callerName,
      data.contactNumber
    )
    if (!editWorkOrderResponse.success) {
      setError(editWorkOrderResponse.error.message)
      return
    }

    const postNoteResponse = await postNote(noteData)

    if (!postNoteResponse.success) {
      setError(postNoteResponse.error.message)
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
            <h2 className="lbh-heading-h2 " style={{ color: '#0CA789' }}>
              Edit description
            </h2>
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
            <h2 className="lbh-heading-h2 " style={{ color: '#0CA789' }}>
              Edit contact details for repair
            </h2>
            <TextInput
              name="callerName"
              label="Caller name"
              hint={'Please enter a caller name'}
              required={true}
              defaultValue={workOrder.callerName}
              isLabelGreen={true}
              register={register({
                required: 'Please enter a caller name',
                maxLength: {
                  value: 50,
                  message:
                    'You have exceeded the maximum amount of 50 characters',
                },
              })}
              error={errors && errors.callerName}
            />
            <TextInput
              name="contactNumber"
              label="Telephone number"
              hint={'Please enter a telephone number'}
              required={true}
              defaultValue={workOrder.callerNumber}
              isLabelGreen={true}
              register={register({
                required: 'Please enter a telephone number',
                validate: (value) => {
                  if (isNaN(value)) {
                    return 'Telephone number should be a number and with no empty spaces'
                  }
                  if (value.length !== 11) {
                    return 'Please enter a valid UK telephone number (11 digits)'
                  }
                },
              })}
              error={errors && errors.contactNumber}
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
            <h3
              className="lbh-heading-h3"
              style={{ color: '#505a5f', fontWeight: 'normal' }}
            >
              Tenants
            </h3>
            <TenantContactsTable tenants={tenants} reloadContacts={contacts} />

            <h3
              className="lbh-heading-h3"
              style={{ color: '#505a5f', fontWeight: 'normal' }}
            >
              Household members
            </h3>
            <ContactsTable contacts={householdMembers} />
          </form>
        </GridColumn>
      </GridRow>
    </div>
  )
}

export default EditWorkOrder
