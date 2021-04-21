import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getFilters } from '../../../utils/frontend-api-client/filters'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import WorkOrdersFilter from './WorkOrdersFilter'

const WorkOrdersFilterView = ({ onFormSubmit, appliedFilters }) => {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [filters, setFilters] = useState()

  const onSubmit = async (formData) => {
    formData.status = { ...formData.status }

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
          <WorkOrdersFilter
            loading={loading}
            filters={filters}
            register={register}
            appliedFilters={appliedFilters}
          />
        </form>
      </div>

      {error && <ErrorMessage label={error} />}
    </>
  )
}

WorkOrdersFilterView.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  appliedFilters: PropTypes.object,
}

export default WorkOrdersFilterView
