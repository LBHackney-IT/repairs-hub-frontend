import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { getSorCodes } from 'src/utils/frontEndApiClient/scheduleOfRates/codes'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import Button from '../Form/Button'
import BackButton from '../Layout/BackButton'
import RateScheduleItem from '../WorkElement/RateScheduleItem'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'

const NewTaskForm = ({ workOrderReference }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [sorCodes, setSorCodes] = useState([])
  const { register } = useForm()

  const getNewTaskForm = async (reference) => {
    setError(null)

    try {
      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${reference}`,
      })
      const sorCodes = await getSorCodes(
        workOrder.tradeCode,
        workOrder.propertyReference,
        workOrder.contractorReference
      )
      setSorCodes(sorCodes)
    } catch (e) {
      setSorCodes([])
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    setError(null)

    getNewTaskForm(workOrderReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <BackButton />
          {sorCodes && (
            <>
              <h1 className="lbh-heading-h2 govuk-!-margin-bottom-4">
                New SOR
              </h1>
              <RateScheduleItem sorCodesList={sorCodes} register={register} />
              <div className="button-pair">
                <Button
                  width="one-third"
                  label="Confirm"
                  type="submit"
                  isSecondary={false}
                />
              </div>
            </>
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default NewTaskForm
