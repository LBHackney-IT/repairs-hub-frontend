import PropTypes from 'prop-types'
import { useState, useContext } from 'react'
import RateScheduleItemView from './RateScheduleItemView'
import TradeDataList from '../../WorkElement/TradeDataList'
import ContractorDataList from './ContractorDataList'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import BudgetCodeItemView from './BudgetCodeItemView'
import UserContext from '@/components/UserContext'
import { canAssignBudgetCode } from '@/utils/userPermissions'

const TradeContractorRateScheduleItemView = ({
  trades,
  propertyReference,
  register,
  errors,
  updatePriority,
  getPriorityObjectByCode,
  setTotalCost,
}) => {
  const [getContractorsError, setGetContractorsError] = useState()
  const [getSorCodesError, setGetSorCodesError] = useState()
  const [getBudgetCodesError, setGetBudgetCodesError] = useState()
  const [loadingContractors, setLoadingContractors] = useState(false)
  const [loadingSorCodes, setLoadingSorCodes] = useState(false)
  const [loadingBudgetCodes, setLoadingBudgetCodes] = useState(false)
  const [tradeCode, setTradeCode] = useState('')
  const [contractors, setContractors] = useState([])
  const [budgetCodes, setBudgetCodes] = useState([])
  const [contractorReference, setContractorReference] = useState('')
  const [sorCodes, setSorCodes] = useState([])
  const [contractorSelectDisabled, setContractorSelectDisabled] = useState(true)
  const [rateScheduleItemDisabled, setRateScheduleItemDisabled] = useState(true)
  const [budgetCodeItemDisabled, setBudgetCodeItemDisabled] = useState(true)

  const { user } = useContext(UserContext)

  const PURDY_CONTRACTOR_REFERENCE = 'PCL'

  const isBudgetCodeRelevant = (contractorRef) =>
    process.env.NEXT_PUBLIC_BUDGET_CODE_SELECTION_ENABLED === 'true' &&
    canAssignBudgetCode(user) &&
    contractorRef === PURDY_CONTRACTOR_REFERENCE

  const onTradeSelect = (event) => {
    const tradeName = event.target.value.split(' - ')[0]
    const tradeCode = trades.filter((trade) => trade.name === tradeName)[0]
      ?.code
    setSorCodes([])
    setBudgetCodes([])

    if (tradeCode?.length) {
      setTradeCode(tradeCode)
      getContractorsData(propertyReference, tradeCode)
    } else {
      setContractorSelectDisabled(true)
      setRateScheduleItemDisabled(true)
      setBudgetCodeItemDisabled(true)
      setContractors([])
      setTradeCode('')
    }
    setLoadingSorCodes(false)
  }

  const onContractorSelect = (event) => {
    const contractorName = event.target.value.split(' - ')[0]
    const contractorRef = contractors.filter(
      (contractor) => contractor.contractorName === contractorName
    )[0]?.contractorReference

    if (contractorRef?.length) {
      setContractorReference(contractorRef)

      isBudgetCodeRelevant(contractorRef)
        ? getBudgetCodesData(contractorRef)
        : getSorCodesData(tradeCode, propertyReference, contractorRef)
    } else {
      setRateScheduleItemDisabled(true)
      setContractorReference('')
    }
  }

  const getContractorsData = async (propertyReference, tradeCode) => {
    setLoadingContractors(true)
    setGetContractorsError(null)

    try {
      const contractors = await frontEndApiRequest({
        method: 'get',
        path: '/api/contractors',
        params: {
          propertyReference: propertyReference,
          tradeCode: tradeCode,
        },
      })

      setContractors(contractors)
      setContractorSelectDisabled(false)
    } catch (e) {
      setContractors([])
      setContractorReference('')
      console.error('An error has occured:', e.response)
      setGetContractorsError(
        `Oops an error occurred getting contractors with error status: ${e.response?.status}`
      )
    }

    setLoadingContractors(false)
  }

  const getBudgetCodesData = async (contractorReference) => {
    setLoadingBudgetCodes(true)
    setGetBudgetCodesError(null)

    try {
      const budgetCodes = await frontEndApiRequest({
        method: 'get',
        path: '/api/workOrders/budget-codes',
        params: {
          contractorReference,
        },
      })

      setBudgetCodes(budgetCodes)
      setBudgetCodeItemDisabled(false)
    } catch (e) {
      setBudgetCodes([])
      console.error('An error has occured:', e.response)
      setGetBudgetCodesError(
        `Oops an error occurred getting budget codes with error status: ${e.response?.status}`
      )
    } finally {
      setLoadingBudgetCodes(false)
    }
  }

  const getSorCodesData = async (tradeCode, propertyRef, contractorRef) => {
    setLoadingSorCodes(true)
    setGetSorCodesError(null)

    try {
      const sorCodes = await frontEndApiRequest({
        method: 'get',
        path: '/api/schedule-of-rates/codes',
        params: {
          tradeCode: tradeCode,
          propertyReference: propertyRef,
          contractorReference: contractorRef,
          isRaisable: true,
        },
      })

      setSorCodes(sorCodes)
      setRateScheduleItemDisabled(false)
    } catch (e) {
      setSorCodes([])
      console.error('An error has occured:', e.response)
      setGetSorCodesError(
        `Oops an error occurred getting SOR codes with error status: ${e.response?.status}`
      )
    }

    setLoadingSorCodes(false)
  }

  return (
    <>
      <TradeDataList
        trades={trades}
        onTradeSelect={onTradeSelect}
        register={register}
        errors={errors}
      />
      <input
        id="tradeCode"
        name="tradeCode"
        type="hidden"
        ref={register}
        value={tradeCode}
      />
      <ContractorDataList
        loading={loadingContractors}
        contractors={contractors}
        onContractorSelect={onContractorSelect}
        disabled={contractorSelectDisabled}
        tradeCode={tradeCode}
        register={register}
        errors={errors}
        apiError={getContractorsError}
      />
      <input
        id="contractorRef"
        name="contractorRef"
        type="hidden"
        ref={register}
        value={contractorReference}
      />
      {isBudgetCodeRelevant(contractorReference) && (
        <>
          <BudgetCodeItemView
            loading={loadingBudgetCodes}
            errors={errors}
            apiError={getBudgetCodesError}
            disabled={budgetCodeItemDisabled}
            budgetCodes={budgetCodes}
            register={register}
            afterValidBudgetCodeSelected={() => {
              getSorCodesData(tradeCode, propertyReference, contractorReference)

              setRateScheduleItemDisabled(false)
            }}
            afterInvalidBudgetCodeSelected={() =>
              setRateScheduleItemDisabled(true)
            }
          />
        </>
      )}
      <RateScheduleItemView
        loading={loadingSorCodes}
        sorCodes={sorCodes}
        disabled={rateScheduleItemDisabled}
        register={register}
        errors={errors}
        isContractorUpdatePage={false}
        updatePriority={updatePriority}
        getPriorityObjectByCode={getPriorityObjectByCode}
        apiError={getSorCodesError}
        setTotalCost={setTotalCost}
      />
    </>
  )
}

TradeContractorRateScheduleItemView.propTypes = {
  trades: PropTypes.array.isRequired,
  propertyReference: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  updatePriority: PropTypes.func.isRequired,
  getPriorityObjectByCode: PropTypes.func.isRequired,
}

export default TradeContractorRateScheduleItemView
