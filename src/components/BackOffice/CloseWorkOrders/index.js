import Layout from '../Layout'
import { useState } from 'react'

import { TextArea, TextInput, Button } from '../../Form'
import ControlledRadio from '../Components/ControlledRadio'

import DatePicker from '../../Form/DatePicker'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import SuccessMessage from '../Components/SuccessMessage'

const radioOptions = [
  {
    text: 'Cancelled - (eg. out of time)',
    value: 'Cancelled',
  },
  {
    text: 'Completed - (close to base)',
    value: 'CloseToBase',
  },
]

const CloseWorkOrders = () => {
  const [selectedOption, setSelectedOption] = useState(radioOptions[0].value)
  const [reasonToClose, setReasonToClose] = useState('')
  const [closedDate, setClosedDate] = useState('')
  const [workOrderReferences, setWorkOrderReferences] = useState('')
  const [errors, setErrors] = useState({})

  const [loading, setLoading] = useState(false)
  const [requestError, setRequestError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)

  const clearForm = () => {
    setReasonToClose('')
    setClosedDate('')
    setWorkOrderReferences('')
    setErrors({})
  }

  const closeToBaseSelected = () => {
    return selectedOption === 'CloseToBase'
  }

  const formatWorkOrderReferences = () => {
    return workOrderReferences
      .split('\n')
      .map((x) => x.trim())
      .filter((x) => x)
  }

  const validateRequest = () => {
    let newErrors = {}

    if (!selectedOption) {
      newErrors.selectedOption = 'Please select an option'
    }

    if (!reasonToClose) {
      newErrors.reasonToClose = 'Please enter a reason to close'
    }

    if (!closedDate && closeToBaseSelected()) {
      newErrors.closedDate = 'Please enter a closed date'
    }

    const strippedWorkOrderReferences = formatWorkOrderReferences()

    const invalidWorkOrderReferences = strippedWorkOrderReferences
      .filter((x) => !validateWorkOrderReference(x))
      .map((x) => `"${x}"`)

    if (strippedWorkOrderReferences.length === 0) {
      newErrors.workOrderReferences = 'Please enter workOrder references'
    } else if (invalidWorkOrderReferences.length > 0) {
      newErrors.workOrderReferences = `Invalid WorkOrder Reference(s) entered: ${invalidWorkOrderReferences.join(
        ', '
      )}`
    }

    return newErrors
  }

  const validateWorkOrderReference = (workOrderReference) => {
    const regex = /^\d{8}$/gm

    return regex.exec(workOrderReference) !== null
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (loading) return

    const newErrors = validateRequest()
    setErrors(newErrors)
    setRequestError(null)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    const formatted = formatWorkOrderReferences()

    const body = {
      reason: reasonToClose,
      completionDate: closedDate,
      workOrderReferences: formatted,
    }

    if (closeToBaseSelected()) body.completionDate = closedDate

    let url = `/api/backOffice/bulk-close/${
      closeToBaseSelected() ? 'close-to-base' : 'cancel'
    }`

    setLoading(true)

    frontEndApiRequest({
      method: 'post',
      path: url,
      requestData: body,
    })
      .then((res) => {
        setFormSuccess(true)
        clearForm()
      })
      .catch((err) => {
        console.error(err)
        setRequestError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Layout title="Bulk-close workOrders">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {formSuccess ? (
            <div>
              <SuccessMessage title="WorkOrders cancelled" />
              <p>
                <a
                  className="lbh-link"
                  role="button"
                  onClick={() => setFormSuccess(null)}
                >
                  Bulk-close more workOrders
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {requestError && <ErrorMessage label={requestError} />}

              <div>
                <ControlledRadio
                  label="Select reason for Closing"
                  name="selectedOption"
                  options={radioOptions}
                  onChange={(event) => setSelectedOption(event.target.value)}
                  selectedOption={selectedOption}
                  error={
                    errors.selectedOption && { message: errors.selectedOption }
                  }
                />
              </div>

              <div>
                <TextInput
                  label="Reason to Close"
                  placeholder="eg. Closed - completed - requested by S Roche"
                  value={reasonToClose}
                  onChange={(event) => setReasonToClose(event.target.value)}
                  error={
                    errors.reasonToClose && { message: errors.reasonToClose }
                  }
                />
              </div>

              {selectedOption === 'CloseToBase' && (
                <div>
                  <DatePicker
                    name="ClosedDate"
                    label="Closed Date"
                    value={closedDate}
                    onChange={(event) => setClosedDate(event.target.value)}
                    defaultValue={new Date()}
                    labelSize="s"
                    error={errors.closedDate && { message: errors.closedDate }}
                  />
                </div>
              )}

              <div>
                <TextArea
                  label="WorkOrder References"
                  placeholder="10008088&#10;10024867&#10;10000782"
                  value={workOrderReferences}
                  onChange={(event) =>
                    setWorkOrderReferences(event.target.value)
                  }
                  error={
                    errors.workOrderReferences && {
                      message: errors.workOrderReferences,
                    }
                  }
                />
              </div>

              <div>
                <Button label="Close WorkOrders" type="submit" />
              </div>
            </form>
          )}
        </>
      )}
    </Layout>
  )
}

export default CloseWorkOrders
