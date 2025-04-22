import { useEffect, useState } from 'react'
import Radios from '../../Form/Radios'
import { WorkOrder } from '@/root/src/models/workOrder'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import { DataList } from '../../Form'
import SpinnerWithLabel from '../../SpinnerWithLabel'
import ErrorMessage from '../../Errors/ErrorMessage'

interface Props {
  register: any
  watch: any
  propertyReference: string
  errors: { [key: string]: { message: string } }
}

const RADIO_OPTIONS = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
]

const RaiseWorkOrderFollowOn = (props: Props) => {
  const { register, errors, watch, propertyReference } = props

  const [showFollowOnLookup, setShowFollowOnLookup] = useState<boolean>(false)

  const isFollowOnWatchedValue = watch('isFollowOn')

  useEffect(() => {
    setShowFollowOnLookup(() => isFollowOnWatchedValue == 'true')
  }, [isFollowOnWatchedValue])

  return (
    <div
      style={{
        background: '#f9f9f9',
        padding: '15px',
      }}
    >
      <Radios
        name="isFollowOn"
        label="Is this for follow on works?"
        labelSize={'s'}
        options={RADIO_OPTIONS.map((x) => ({
          ...x,
          defaultChecked: false,
          children:
            x.value === true ? (
              <FollowOnLookup
                visible={showFollowOnLookup}
                propertyReference={propertyReference}
                register={register}
                errors={errors}
              />
            ) : null,
        }))}
        error={errors && errors.isFollowOn}
        register={register({
          required: 'Please select an option',
        })}
      />

      <div>
        <a
          className="lbh-link"
          href={`/search`}
          target="_blank"
          rel="noreferrer"
        >
          Look up work order number
        </a>
      </div>
    </div>
  )
}

const FollowOnLookup = ({
  visible,
  propertyReference,
  register,
  errors,
}: {
  visible: boolean
  propertyReference: string
  register: any
  errors: { [key: string]: { message: string } }
}) => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRelatedWorkOrders = async () => {
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

      setWorkOrders(workOrders)
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
      <DataList
        name="originalWorkOrder"
        label="Please select the original work order this relates to"
        options={workOrders?.map((x) => x.reference) || []}
        register={register({
          required: 'Please select a work order',
          validate: (value) =>
            isValidWorkOrderReference(value) || 'Invalid work order reference',
        })}
        error={errors && errors.originalWorkOrder}
        widthClass="govuk-!-width-one-half"
      />
      {error && <ErrorMessage label={error} />}
    </div>
  )
}

export default RaiseWorkOrderFollowOn
