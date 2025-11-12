import {
  useState,
  useContext,
  useEffect,
  SetStateAction,
  Dispatch,
} from 'react'
import RateScheduleItemView from './RateScheduleItemView'
import TradeDataList from '../../WorkElement/TradeDataList'
import ContractorDataList from './ContractorDataList'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import BudgetCodeItemView from './BudgetCodeItemView'
import UserContext from '@/components/UserContext'
import { canAssignBudgetCode } from '@/utils/userPermissions'
import { MULTITRADE_TRADE_CODE } from '@/utils/constants'
import { getContractor } from '@/root/src/utils/requests/contractor'
import { APIResponseError } from '@/root/src/types/requests/types'
import Contractor from '@/root/src/models/contractor'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'
import SorCode from '@/root/src/models/sorCode'
import { BudgetCode } from '@/root/src/models/budgetCode'
import { DeepMap, FieldError } from 'react-hook-form'
import { Priority } from '@/root/src/models/priority'
import { Trade } from '@/root/src/models/trade'

interface Props {
  trades: Trade[]
  sorCodeArrays: SorCode[][]
  setSorCodeArrays: Dispatch<SetStateAction<SorCode[][]>>
  propertyReference: string
  register: any
  errors: DeepMap<any, FieldError>
  updatePriority: (
    description: any,
    code: any,
    rateScheduleItemsLength: any,
    existingHigherPriorityCode: any
  ) => void
  getPriorityObjectByCode: (code: any) => Priority
  tradeCode: string
  setTradeCode: Dispatch<SetStateAction<string>>
  contractorReference: string
  setContractorReference: Dispatch<SetStateAction<string>>
  budgetCodeId: string | number
  setBudgetCodeId: Dispatch<SetStateAction<string>>
  setPageToMultipleSORs: () => void
  contractors: Contractor[]
  setContractors: Dispatch<SetStateAction<Contractor[]>>
  budgetCodes: BudgetCode[]
  setBudgetCodes: Dispatch<SetStateAction<BudgetCode[]>>
  setTotalCost: Dispatch<SetStateAction<string>>
  setValue: (
    name: string,
    value: any,
    config?: Partial<{
      shouldValidate: boolean
      shouldDirty: boolean
    }>
  ) => void
  formState: any
  isIncrementalSearchEnabled: boolean
  setIsIncrementalSearchEnabled: Dispatch<SetStateAction<boolean>>
  enablePriorityField: () => void
}

const TradeContractorRateScheduleItemView = (props: Props) => {
  const {
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
    formState,
    isIncrementalSearchEnabled,
    setIsIncrementalSearchEnabled,
    enablePriorityField,
  } = props
  const [getContractorsError, setGetContractorsError] = useState<
    string | null
  >()
  const [getSorCodesError, setGetSorCodesError] = useState<string | null>()
  const [getBudgetCodesError, setGetBudgetCodesError] = useState<
    string | null
  >()
  const [getContractorError, setGetContractorError] = useState<string | null>()

  const [loadingContractor, setLoadingContractor] = useState<boolean>(false)
  const [loadingContractors, setLoadingContractors] = useState<boolean>(false)
  const [loadingSorCodes, setLoadingSorCodes] = useState<boolean>(false)
  const [loadingBudgetCodes, setLoadingBudgetCodes] = useState<boolean>(false)

  const [contractor, setContractor] = useState<Contractor>()

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
    tradeName === 'Multi Trade'
      ? setIsIncrementalSearchEnabled(true)
      : setIsIncrementalSearchEnabled(false)
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
    checkIfIncrementalSearchRequired(contractor)
  }, [contractor])

  const checkIfIncrementalSearchRequired = async (contractor: Contractor) => {
    const orderApplicable =
      (contractor?.multiTradeEnabled && tradeCode === MULTITRADE_TRADE_CODE) ||
      isIncrementalSearchEnabled

    if (!orderApplicable) {
      setOrderRequiresIncrementalSearch(false)
      return false
    }

    setOrderRequiresIncrementalSearch(orderApplicable)

    return orderApplicable
  }

  const prepareSORData = async (contractor: Contractor, tradeCode: string) => {
    const incrementalSearch = await checkIfIncrementalSearchRequired(contractor)

    if (incrementalSearch) {
      resetSORs()
    } else {
      getSorCodesData(
        tradeCode,
        propertyReference,
        contractor.contractorReference
      )
    }
  }

  const onContractorSelect = async (event) => {
    const contractorName = event.target.value.split(' - ')[0]

    // Finds contractor from provided list
    const contractorRef = contractors.filter(
      (contractor) => contractor.contractorName === contractorName
    )[0]?.contractorReference

    if (!contractorRef?.length) {
      // skips, contractor not found
      setContractorReference('')
      return
    }

    setContractorReference(contractorRef)

    setGetContractorError(null)
    setLoadingContractor(true)

    const contractorResponse = await getContractor(contractorRef)

    setLoadingContractor(false)

    if (!contractorResponse.success) {
      console.error('An error has occured:', contractorResponse.error)

      if (contractorResponse.error instanceof APIResponseError) {
        setGetContractorError(contractorResponse.error.message)
      } else {
        setGetContractorError(
          formatRequestErrorMessage(contractorResponse.error)
        )
      }
      return
    }

    setContractor(contractorResponse.response)

    if (
      process.env.NEXT_PUBLIC_BUDGET_CODE_SELECTION_ENABLED === 'true' &&
      canAssignBudgetCode(user)
    ) {
      // gets budget codes
      getBudgetCodesData(contractorRef)
    } else {
      // gets sor codes
      await prepareSORData(contractorResponse.response, tradeCode)
    }
  }

  const getContractorsData = async (
    propertyReference: string,
    tradeCode: string
  ) => {
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
      const params = {}

      if (contractor && contractor?.multiTradeEnabled) {
        params['contractorReference'] = contractorReference
      }

      const budgetCodes = await frontEndApiRequest({
        method: 'get',
        path: '/api/workOrders/budget-codes',
        params,
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
        register={register}
        errors={errors}
        apiError={getContractorsError || getContractorError}
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
            loading={loadingBudgetCodes || loadingContractor}
            errors={errors}
            apiError={getBudgetCodesError}
            disabled={!(tradeCode && contractorReference)}
            budgetCodes={budgetCodes}
            budgetCodeId={budgetCodeId}
            setBudgetCodeId={setBudgetCodeId}
            register={register}
            afterValidBudgetCodeSelected={async () => {
              await prepareSORData(contractor, tradeCode)
            }}
          />
        </>
      )}

      <RateScheduleItemView
        loading={loadingSorCodes || loadingContractor}
        disabled={((budgetCodeRequired) => {
          if (budgetCodeRequired) {
            return !(tradeCode && contractorReference && budgetCodeId)
          } else {
            return !(tradeCode && contractorReference)
          }
        })(budgetCodeApplicable(user))}
        register={register}
        errors={errors}
        updatePriority={updatePriority}
        getPriorityObjectByCode={getPriorityObjectByCode}
        apiError={getSorCodesError}
        setTotalCost={setTotalCost}
        sorCodeArrays={sorCodeArrays}
        setSorCodeArrays={setSorCodeArrays}
        sorSearchRequest={orderRequiresIncrementalSearch && sorSearchRequest}
        setPageToMultipleSORs={setPageToMultipleSORs}
        formState={formState}
        enablePriorityField={enablePriorityField}
      />
    </>
  )
}

export default TradeContractorRateScheduleItemView
