import PropTypes from 'prop-types'
import { useState } from 'react'
import RateScheduleItemView from './RateScheduleItemView'
import TradeDataList from '../../WorkElement/TradeDataList'
import ContractorDataList from './ContractorDataList'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import BudgetCodeItemView from './BudgetCodeItemView'

{
  /*TODO: check the user (only certain user group can assign budget code )*/
}
{
  /*TODO: add method to userPermission file (userCanAssignBudget code: something like that*/
}
{
  /*TODO: Budget code list appears based on which trade and contractor were selected*/
}
{
  /*TODO: add hidden fields for values (maybe 2 hidden fields, depends what we get from b/e*/
}
{
  /*TODO: check Capital code selection scenario (after all the logic is implemented*/
}
{
  /*TODO: feature flag for budget code selection*/
}
{
  /*TODO: add to .env and to user.js userGroup "Agent?"*/
}
{
  /*TODO: work order fixture after we know what b/e response look like*/
}
{
  /*TODO: test: check Neil's spike in github*/
}
{
  /*TODO: Ask Raffaella about  'Authorisation and variation pages, pending authorisation tab' for design*/
}

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
  const [budgetCodeSelected, setBudgetCodeSelected] = useState('')
  const [sorCodes, setSorCodes] = useState([])
  const [contractorSelectDisabled, setContractorSelectDisabled] = useState(true)
  const [rateScheduleItemDisabled, setRateScheduleItemDisabled] = useState(true)
  const [budgetCodeItemDisabled, setBudgetCodeItemDisabled] = useState(true)

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
      //Here later also add check if user is the one that can assign budget code
      process.env.NEXT_PUBLIC_BUDGET_CODE_SELECTION_ENABLED === 'true'
        ? getBudgetCodesData(tradeCode, propertyReference, contractorRef)
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

  const getBudgetCodesData = async () => {
    setLoadingBudgetCodes(true)
    setGetBudgetCodesError(null)

    const budgetCodes = [1, 2, 3]
    setBudgetCodes(budgetCodes)
    setBudgetCodeItemDisabled(false)

    //call to budget codes API
    // try {
    //   const budgetCodes = await frontEndApiRequest({
    //     method: 'get',
    //     path: '/api/budgetCodes',
    //     params: {
    //       contractorReference: contractorReference,
    //     },
    //   })

    //   setBudgetCodes(budgetCodes)
    //   setBudgetCodeItemDisabled(false)
    // } catch (e) {
    //   setBudgetCodes([])
    //   console.error('An error has occured:', e.response)
    //   setGetBudgetCodesError(
    //     `Oops an error occurred getting contractors with error status: ${e.response?.status}`
    //   )
    // }
    setTimeout(() => {
      setLoadingBudgetCodes(false)
    }, 2000)
  }

  const onBudgetSelect = (event) => {
    //need to check how this will look like exactly
    const budgetName = event.target.value
    const budgetCode = budgetCodes.filter((code) => code == budgetName)

    if (budgetCode?.length) {
      setBudgetCodeSelected(budgetCode)
      getSorCodesData(tradeCode, propertyReference, contractorReference)
    } else {
      setRateScheduleItemDisabled(true)
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

      {/*Here later also add check if user is the one that can assign budget code*/}
      {process.env.NEXT_PUBLIC_BUDGET_CODE_SELECTION_ENABLED === 'true' && (
        <BudgetCodeItemView
          loading={loadingBudgetCodes}
          register={register}
          errors={errors}
          apiError={getBudgetCodesError}
          disabled={budgetCodeItemDisabled}
          budgetCodes={budgetCodes}
          onBudgetSelect={onBudgetSelect}
        />
      )}
      {/* put relevant info here, base on what b/e will give me*/}
      <input
        id="contractorRef"
        name="contractorRef"
        type="hidden"
        ref={register}
        value={budgetCodeSelected}
      />
      <input
        id="contractorRef"
        name="contractorRef"
        type="hidden"
        ref={register}
        value={budgetCodeSelected}
      />

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
