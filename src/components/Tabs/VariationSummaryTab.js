import PropTypes from 'prop-types'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import UserContext from '../UserContext'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import VariationAuthorisationSummary from '../WorkOrder/Authorisation/VariationAuthorisationSummary'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { calculateTotalVariedCost } from '@/utils/helpers/calculations'

const VariationSummaryTab = ({ workOrderReference }) => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [variationTasks, setVariationTasks] = useState({})
  const [originalSors, setOriginalSors] = useState([])
  const { user } = useContext(UserContext)
  const [totalCostAfterVariation, setTotalCostAfterVariation] = useState()

  const requestVariationTasks = async (workOrderReference) => {
    setError(null)

    try {
      const variationTasks = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/variation-tasks`,
      })

      setVariationTasks(variationTasks)
      const totalCostAfterVariation = calculateTotalVariedCost(
        variationTasks.tasks
      )
      setTotalCostAfterVariation(totalCostAfterVariation)
    } catch (e) {
      setVariationTasks(null)
      console.error('An error has occured:', e.response)
      if (e.response?.status === 404) {
        setError(
          `Could not find a work order with reference ${workOrderReference}`
        )
      } else {
        setError(
          `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
        )
      }
    }

    setLoading(false)
  }

  const getTasksAndSorsView = async (workOrderReference) => {
    setError(null)

    try {
      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })

      setOriginalSors(tasksAndSors.filter((t) => t.original))
    } catch (e) {
      setOriginalSors(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    requestVariationTasks(workOrderReference)
    getTasksAndSorsView(workOrderReference)
  }, [])

  if (loading) return <Spinner />

  if (variationTasks && variationTasks.tasks && originalSors) {
    return (
      <>
        {user.roles.includes('contract_manager') && (
          <div className="display-inline">
            <Link
              href={`/work-orders/${workOrderReference}/variation-authorisation`}
            >
              <a className="lbh-link">Variation Authorisation</a>
            </Link>
          </div>
        )}

        <VariationAuthorisationSummary
          variationTasks={variationTasks}
          originalSors={originalSors}
          totalCostAfterVariation={totalCostAfterVariation}
        />
        {error && <ErrorMessage label={error} />}
      </>
    )
  }

  return (
    <p className="lbh-body-s">There are no variations for this work order.</p>
  )
}

VariationSummaryTab.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default VariationSummaryTab
