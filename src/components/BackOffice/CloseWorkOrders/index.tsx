import Layout from '../Layout'
import React, { useState } from 'react'

import { TextArea, TextInput, Button } from '../../Form'
import ControlledRadio from '../Components/ControlledRadio'

import DatePicker from '../../Form/DatePicker'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import SuccessMessage from '../Components/SuccessMessage'

import { CloseWorkOrdersRequest, Errors, RadioInputOption } from './types'

const radioOptions: Array<RadioInputOption> = [
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
  const [selectedOption, setSelectedOption] = useState<string>(radioOptions[0].value)
  const [reasonToClose, setReasonToClose] = useState<string>('')
  const [closedDate, setClosedDate] = useState<string>('')
  const [workOrderReferences, setWorkOrderReferences] = useState<string>('')
  const [errors, setErrors] = useState<Errors>({})

  const [loading, setLoading] = useState<boolean>(false)
  const [requestError, setRequestError] = useState(null)
  const [formSuccess, setFormSuccess] = useState<boolean>(null)

  const closeToBaseSelected = (): boolean => {
    return selectedOption === 'CloseToBase'
  }

  const validateRequest = (): Errors => {
    const newErrors: Errors = {}

    if (!selectedOption) {
      newErrors.selectedOption = 'Please select an option'
    }

    if (!reasonToClose) {
      newErrors.reasonToClose = 'Please enter a reason to close'
    }

    if (!closedDate && closeToBaseSelected()) {
      newErrors.closedDate = 'Please enter a closed date'
    }

    if (!workOrderReferences) {
      newErrors.workOrderReferences = 'Please enter some workOrder references'
    }

    return newErrors
  }

  const handleSubmit = (event: React.SyntheticEvent) : Promise<void> => {
    event.preventDefault()

    if (loading) return

    const newErrors = validateRequest()
    setErrors(newErrors)
    setRequestError(null)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    const formatted = workOrderReferences.trim().replaceAll(',', '').split('\n')

    const body : CloseWorkOrdersRequest = {
      reason: reasonToClose,
      completionDate: closedDate,
      workOrderReferences: formatted,
    }

    if (closeToBaseSelected()) body.completionDate = closedDate

    const url = `/api/backOffice/bulk-close/${
      closeToBaseSelected() ? 'close-to-base' : 'cancel'
    }`

    setLoading(true)

    frontEndApiRequest({
      method: 'post',
      path: url,
      requestData: body,
      params: null,
      paramsSerializer: null
    })
      .then(() => {
        setFormSuccess(true)
      })
      .catch((err: ErrorEvent) => {
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
        
        <Spinner resource={null} />
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
              {requestError && (
                <>
                {/*  @ts-ignore */}
                <ErrorMessage label={requestError} /></>
              )}

              <div>
                {/*  @ts-ignore */}
                <ControlledRadio
                  label="Select reason for Closing"
                  name="selectedOption"
                  options={radioOptions.map(x => x.value)}
                  onChange={(event) => setSelectedOption(event.target.value)}
                  selectedOption={selectedOption}
                  error={
                    errors.selectedOption && { message: errors.selectedOption }
                  }
                />
              </div>

              <div>
                {/*  @ts-ignore */}
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
                  {/*  @ts-ignore */}
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
                 {/*  @ts-ignore */}
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
                {/*  @ts-ignore */}
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
