import { useEffect, useState } from 'react'
import ErrorMessage from '../../../Errors/ErrorMessage'
import { DataList } from '../../../Form'
import SpinnerWithLabel from '../../../SpinnerWithLabel'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/root/src/models/workOrder'

interface Props {
  visible: boolean
  propertyReference: string
  register: any
  errors: { [key: string]: { message: string } }
}

const FollowOnLookup = (props: Props) => {
  const { visible, propertyReference, register, errors } = props

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRelatedWorkOrders = async () => {
    if (workOrders.length > 0) {
      // we dont need to fetch new data
      return
    }

    setError(null)
    setIsLoading(true)

    // Fetch 5 most recent work orders
    try {
      const workOrders = await frontEndApiRequest({
        path: '/api/workOrders/',
        method: 'get',
        params: {
          propertyReference: propertyReference,
          PageSize: 5,
          PageNumber: 1,
          sort: 'dateraised:desc',
        },
      })

      setWorkOrders(() => workOrders)
    } catch (e) {
      setWorkOrders(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${
          e.response?.status
        } with message: ${JSON.stringify(e.response?.data?.message)}`
      )
    }

    setIsLoading(false)
  }

  const isValidWorkOrderReference = (value) => {
    // Check if value is an 8-digit number only
    return /^\d{8}$/.test(value)
  }

  useEffect(() => {
    if (isLoading) return
    if (!visible) return

    fetchRelatedWorkOrders()
  }, [visible])

  if (!visible) return null

  if (isLoading) {
    return <SpinnerWithLabel label="Fetching recent work orders" />
  }

  return (
    <div>
      {/* @ts-expect-error Props validation */}
      <DataList
        name="parentWorkOrder"
        label="Please select the original work order this relates to"
        options={workOrders?.map((x) => x.reference) || []}
        register={register({
          required: 'Please select a work order',
          validate: (value) =>
            isValidWorkOrderReference(value) || 'Invalid work order reference',
        })}
        error={errors && errors.parentWorkOrder}
        widthClass="govuk-!-width-one-half"
      />
      {error && <ErrorMessage label={error} />}
    </div>
  )
}

export default FollowOnLookup
