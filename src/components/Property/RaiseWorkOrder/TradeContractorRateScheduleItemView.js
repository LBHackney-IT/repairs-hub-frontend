import PropTypes from 'prop-types'
import { useState, useContext, useEffect } from 'react'
import RateScheduleItemView from './RateScheduleItemView'
import TradeDataList from '../../WorkElement/TradeDataList'
import ContractorDataList from './ContractorDataList'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import BudgetCodeItemView from './BudgetCodeItemView'
import UserContext from '@/components/UserContext'
import { canAssignBudgetCode } from '@/utils/userPermissions'
import {
  MULTITRADE_TRADE_CODE,
  MULTITRADE_ENABLED_CONTRACTORS,
  MULTITRADE_CONTRACTORS_WITHOUT_MULTITRADE_SORCODES,
} from '@/utils/constants'

const TradeContractorRateScheduleItemView = ({
  trades,
  tradeCode,
  setTradeCode,
  contractors,
  contractorReference,
  setContractorReference,
  setContractors,
  budgetCodeId,
  setBudgetCodeId,
  budgetCodes,
  setBudgetCodes,
  sorCodeArrays,
  setSorCodeArrays,
  propertyReference,
  register,
  errors,
  updatePriority,
  getPriorityObjectByCode,
  setTotalCost,
  setValue,
  setPageToMultipleSORs,
  filterPriorities,
  formState,
}) => {
  const [getContractorsError, setGetContractorsError] = useState()
  const [getSorCodesError, setGetSorCodesError] = useState()
  const [getBudgetCodesError, setGetBudgetCodesError] = useState()
  const [loadingContractors, setLoadingContractors] = useState(false)
  const [loadingSorCodes, setLoadingSorCodes] = useState(false)
  const [loadingBudgetCodes, setLoadingBudgetCodes] = useState(false)

  const [
    orderRequiresIncrementalSearch,
    setOrderRequiresIncrementalSearch,
  ] = useState(false)

  const { user } = useContext(UserContext)

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
      setContractors([])
      setTradeCode('')
    }
  }

  useEffect(() => {
    checkIfIncrementalSearchRequired(contractorReference, tradeCode)
  }, [])

  const checkIfIncrementalSearchRequired = async (contractorRef, tradeCode) => {
    const orderApplicable =
      MULTITRADE_ENABLED_CONTRACTORS.includes(contractorRef) &&
      tradeCode === MULTITRADE_TRADE_CODE

    if (!orderApplicable) {
      setOrderRequiresIncrementalSearch(false)
      return false
    }

    setOrderRequiresIncrementalSearch(orderApplicable)

    return orderApplicable
  }

  const prepareSORData = async (contractorRef, tradeCode) => {
    const incrementalSearch = await checkIfIncrementalSearchRequired(
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

      if (
        process.env.NEXT_PUBLIC_BUDGET_CODE_SELECTION_ENABLED === 'true' &&
        canAssignBudgetCode(user)
      ) {
        getBudgetCodesData(contractorRef)
      } else {
        await prepareSORData(contractorRef, tradeCode)
      }
      var ctr = contractorRef.toLowerCase()

      if (ctr.includes('h02')) {
        filterPriorities('VOIDS')
      }
    } else {
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

      // Add multitrade contractors who don't have any MT SORs
      // (only Purdy, Axis and HHL already have some)
      tradeCode === MULTITRADE_TRADE_CODE
        ? setContractors([
            ...contractors,
            ...MULTITRADE_CONTRACTORS_WITHOUT_MULTITRADE_SORCODES,
          ])
        : setContractors(contractors)
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
          ...(MULTITRADE_ENABLED_CONTRACTORS.includes(contractorReference)
            ? { contractorReference: contractorReference }
            : ''),
        },
      })

      setBudgetCodes(budgetCodes)
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

      setSorCodeArrays([
        sorCodes.sort((a, b) => {
          return b.displayPriority - a.displayPriority
        }),
      ])
    } catch (e) {
      resetSORs()
      console.error('An error has occured:', e.response)
      setGetSorCodesError(
        `Oops an error occurred getting SOR codes with error status: ${e.response?.status}`
      )
    }

    setLoadingSorCodes(false)
  }

  const budgetCodeApplicable = (user) =>
    process.env.NEXT_PUBLIC_BUDGET_CODE_SELECTION_ENABLED === 'true' &&
    canAssignBudgetCode(user)

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
        disabled={!tradeCode}
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

      {budgetCodeApplicable(user) && (
        <>
          <BudgetCodeItemView
            loading={loadingBudgetCodes}
            errors={errors}
            apiError={getBudgetCodesError}
            disabled={!(tradeCode && contractorReference)}
            budgetCodes={budgetCodes}
            budgetCodeId={budgetCodeId}
            setBudgetCodeId={setBudgetCodeId}
            register={register}
            afterValidBudgetCodeSelected={async () => {
              await prepareSORData(contractorReference, tradeCode)
            }}
          />
        </>
      )}

      <RateScheduleItemView
        loading={loadingSorCodes}
        disabled={((budgetCodeRequired) => {
          if (budgetCodeRequired) {
            return !(tradeCode && contractorReference && budgetCodeId)
          } else {
            return !(tradeCode && contractorReference)
          }
        })(budgetCodeApplicable(user))}
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
        setPageToMultipleSORs={setPageToMultipleSORs}
        formState={formState}
      />
    </>
  )
}

TradeContractorRateScheduleItemView.propTypes = {
  trades: PropTypes.array.isRequired,
  sorCodeArrays: PropTypes.array.isRequired,
  setSorCodeArrays: PropTypes.func.isRequired,
  propertyReference: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  updatePriority: PropTypes.func.isRequired,
  getPriorityObjectByCode: PropTypes.func.isRequired,
  tradeCode: PropTypes.string.isRequired,
  setTradeCode: PropTypes.func.isRequired,
  contractorReference: PropTypes.string.isRequired,
  setContractorReference: PropTypes.func.isRequired,
  budgetCodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  setBudgetCodeId: PropTypes.func.isRequired,
  setPageToMultipleSORs: PropTypes.func.isRequired,
  filterPriorities: PropTypes.func.isRequired,
}

export default TradeContractorRateScheduleItemView
