import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Checkbox, PrimarySubmitButton } from '../Form'
import { getFilters } from '../../utils/frontend-api-client/filters'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import Spinner from '../Spinner/Spinner'

const WorkOrdersFilter = ({ onFormSubmit, appliedFilters }) => {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [filters, setFilters] = useState()

  console.log('appliedFilters', appliedFilters)

  const onSubmit = async (formData) => {
    formData.status = { ...formData.status }

    console.log('onSubmit2', formData)
    onFormSubmit(formData)
  }

  const getWorkOrdersFilterView = async () => {
    setError(null)

    try {
      const workOrderFilters = await getFilters('WorkOrder')

      setFilters(workOrderFilters)
    } catch (e) {
      setFilters(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getWorkOrdersFilterView()
  }, [])

  return (
    <>
      <div>
        <form
          role="form"
          id="repair-request-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <details className="govuk-details" data-module="govuk-details">
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">Filters</span>
            </summary>

            {loading ? (
              <Spinner />
            ) : (
              <>
                {filters && (
                  <>
                    <div className="govuk-form-group lbh-form-group">
                      <fieldset className="govuk-fieldset">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                          Status
                        </legend>

                        <div className="govuk-checkboxes">
                          {filters.Status.map((status, index) => (
                            <Checkbox
                              key={index}
                              name={`StatusCode.${status.key}`}
                              label={status.description}
                              register={register}
                              checked={appliedFilters?.StatusCode?.includes(
                                status.key
                              )}
                            />
                          ))}
                        </div>
                      </fieldset>
                    </div>

                    <PrimarySubmitButton label="Apply filters" />
                  </>
                )}
              </>
            )}
          </details>
        </form>
      </div>

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default WorkOrdersFilter
