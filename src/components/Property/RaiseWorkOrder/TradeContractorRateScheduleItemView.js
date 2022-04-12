import PropTypes from 'prop-types'
import { useState, useContext } from 'react'
import RateScheduleItemView from './RateScheduleItemView'
import TradeDataList from '../../WorkElement/TradeDataList'
import ContractorDataList from './ContractorDataList'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import BudgetCodeItemView from './BudgetCodeItemView'
import UserContext from '@/components/UserContext'
import { canAssignBudgetCode } from '@/utils/userPermissions'
import {
  MULTITRADE_TRADE_CODE,
  PURDY_CONTRACTOR_REFERENCE,
} from '@/utils/constants'

const TradeContractorRateScheduleItemView = ({
  trades,
  propertyReference,
  register,
  errors,
  updatePriority,
  getPriorityObjectByCode,
  setTotalCost,
  setValue,
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
  const [contractorSelectDisabled, setContractorSelectDisabled] = useState(true)
  const [rateScheduleItemDisabled, setRateScheduleItemDisabled] = useState(true)
  const [budgetCodeItemDisabled, setBudgetCodeItemDisabled] = useState(true)
  const [sorCodeArrays, setSorCodeArrays] = useState([[]])

  const [
    orderRequiresIncrementalSearch,
    setOrderRequiresIncrementalSearch,
  ] = useState(false)

  let multiTradeSORIncrementalSearchEnabled = null

  const { user } = useContext(UserContext)

  const isBudgetCodeRelevant = (contractorRef) =>
    process.env.NEXT_PUBLIC_BUDGET_CODE_SELECTION_ENABLED === 'true' &&
    canAssignBudgetCode(user) &&
    contractorRef === PURDY_CONTRACTOR_REFERENCE

  const resetSORs = () => {
    sorCodeArrays.forEach((array, index) => {
      setValue(`rateScheduleItems[${index}][code]`, '')
      setValue(`rateScheduleItems[${index}][description]`, '')
      setValue(`rateScheduleItems[${index}][cost]`, '')
      setValue(`rateScheduleItems[${index}][quantity]`, '')
    })

    setSorCodeArrays((sorCodeArrays) => sorCodeArrays.map(() => []))
  }

  const onTradeSelect = (event) => {
    const tradeName = event.target.value.split(' - ')[0]
    const newTradeCode = trades.filter((trade) => trade.name === tradeName)[0]
      ?.code

    setBudgetCodes([])

    if (newTradeCode?.length) {
      setTradeCode(newTradeCode)

      resetSORs()

      getContractorsData(propertyReference, newTradeCode)
    } else {
      setContractorSelectDisabled(true)
      setRateScheduleItemDisabled(true)
      setBudgetCodeItemDisabled(true)
      setContractors([])
      setTradeCode('')
    }
  }

  const incrementalSORSearchRequired = async (contractorRef, tradeCode) => {
    const orderApplicable =
      contractorRef === PURDY_CONTRACTOR_REFERENCE &&
      tradeCode === MULTITRADE_TRADE_CODE

    if (!orderApplicable) {
      setOrderRequiresIncrementalSearch(false)
      return false
    }

    if (multiTradeSORIncrementalSearchEnabled === null) {
      const configurationData = await frontEndApiRequest({
        method: 'GET',
        path: '/api/toggles',
      })

      ;({
        featureToggles: {
          MultiTradeSORIncrementalSearch: multiTradeSORIncrementalSearchEnabled = false,
        } = {},
      } = configurationData[0] || {})
    }

    setOrderRequiresIncrementalSearch(
      orderApplicable && multiTradeSORIncrementalSearchEnabled
    )

    return orderApplicable && multiTradeSORIncrementalSearchEnabled
  }

  const prepareSORData = async (contractorRef, tradeCode) => {
    const incrementalSearch = await incrementalSORSearchRequired(
      contractorRef,
      tradeCode
    )

    if (incrementalSearch) {
      resetSORs()
    } else {
      getSorCodesData(tradeCode, propertyReference, contractorRef)
    }
  }

  const onContractorSelect = async (event) => {
    const contractorName = event.target.value.split(' - ')[0]
    const contractorRef = contractors.filter(
      (contractor) => contractor.contractorName === contractorName
    )[0]?.contractorReference

    if (contractorRef?.length) {
      setContractorReference(contractorRef)

      if (isBudgetCodeRelevant(contractorRef)) {
        getBudgetCodesData(contractorRef)
      } else {
        await prepareSORData(contractorRef, tradeCode)
        setRateScheduleItemDisabled(false)
      }
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

      setSorCodeArrays([sorCodes])
      setRateScheduleItemDisabled(false)
    } catch (e) {
      resetSORs()
      console.error('An error has occured:', e.response)
      setGetSorCodesError(
        `Oops an error occurred getting SOR codes with error status: ${e.response?.status}`
      )
    }

    setLoadingSorCodes(false)
  }

  // When searching large numbers of SORs, we make an SOR request
  // with a specific text filter.
  const sorSearchRequest = (searchText) =>
    frontEndApiRequest({
      method: 'get',
      path: '/api/schedule-of-rates/codes',
      params: {
        tradeCode: tradeCode,
        propertyReference: propertyReference,
        contractorReference: contractorReference,
        isRaisable: true,
        filter: searchText,
        showAllTrades: true,
      },
    })

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
            afterValidBudgetCodeSelected={async () => {
              await prepareSORData(contractorReference, tradeCode)
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
        disabled={rateScheduleItemDisabled}
        register={register}
        errors={errors}
        isContractorUpdatePage={false}
        updatePriority={updatePriority}
        getPriorityObjectByCode={getPriorityObjectByCode}
        apiError={getSorCodesError}
        setTotalCost={setTotalCost}
        sorCodeArrays={sorCodeArrays}
        setSorCodeArrays={setSorCodeArrays}
        sorSearchRequest={orderRequiresIncrementalSearch && sorSearchRequest}
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
