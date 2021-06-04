import PropTypes from 'prop-types'
import { useState, useEffect, useContext } from 'react'
import UserContext from '../UserContext/UserContext'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import VariationAuthorisationSummary from '../WorkOrder/Authorisation/VariationAuthorisationSummary'
import { getVariationTasks } from '../../utils/frontend-api-client/variation-tasks'
import { getTasksAndSors } from '../../utils/frontend-api-client/work-orders/[id]/tasks'
import { calculateTotalVariedCost } from '../../utils/helpers/calculations'

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
      const variationTasks = await getVariationTasks(workOrderReference)

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
      const tasksAndSors = await getTasksAndSors(workOrderReference)

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

  const variationAuthLink = () => {
    if (user.roles.includes('contract_manager')) {
      return (
        <div className="display-inline">
          <a
            href={`/work-orders/${workOrderReference}/variation-authorisation               `}
            className="repairs-hub-link lbh-body-s"
          >
            Variation Authorisation
          </a>
        </div>
      )
    }
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {variationTasks && variationTasks.tasks && originalSors ? (
            <>
              {variationAuthLink()}
              <VariationAuthorisationSummary
                variationTasks={variationTasks}
                originalSors={originalSors}
                totalCostAfterVariation={totalCostAfterVariation}
              />
              {error && <ErrorMessage label={error} />}
            </>
          ) : (
            <>
              <p className="lbh-body-s">
                There are no variations for this work order.
              </p>
            </>
          )}
        </>
      )}
    </>
  )
}

VariationSummaryTab.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default VariationSummaryTab
