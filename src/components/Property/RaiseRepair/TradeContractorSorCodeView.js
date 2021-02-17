import PropTypes from 'prop-types'
import { useState } from 'react'
import SorCodeSelectView from './SorCodeSelectView'
import TradeDataList from './TradeDataList'
import ContractorSelect from './ContractorSelect'
import { getContractors } from '../../../utils/frontend-api-client/contractors'
import { getSorCodesByTradeAndContractor } from '../../../utils/frontend-api-client/schedule-of-rates/codes'

const TradeContractorSorCodeView = ({
  trades,
  propertyReference,
  register,
  errors,
  updatePriority,
  getPriorityObjectByCode,
}) => {
  const [getContractorsError, setGetContractorsError] = useState()
  const [getSorCodesError, setGetSorCodesError] = useState()
  const [loadingContractors, setLoadingContractors] = useState(false)
  const [loadingSorCodes, setLoadingSorCodes] = useState(false)
  const [tradeCode, setTradeCode] = useState('')
  const [contractors, setContractors] = useState([])
  const [contractorReference, setContractorReference] = useState('')
  const [sorCodes, setSorCodes] = useState([])
  const [contractorSelectDisabled, setContractorSelectDisabled] = useState(true)
  const [sorCodeSelectDisabled, setSorCodeSelectDisabled] = useState(true)

  const onTradeSelect = (event) => {
    const tradeName = event.target.value.split(' - ')[0]
    const tradeCode = trades.filter((trade) => trade.name === tradeName)[0]
      ?.code
    setSorCodes([])

    if (tradeCode?.length) {
      setTradeCode(tradeCode)
      getContractorsData(propertyReference, tradeCode)
    } else {
      setContractorSelectDisabled(true)
      setSorCodeSelectDisabled(true)
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
      getSorCodesData(tradeCode, propertyReference, contractorRef)
    } else {
      setSorCodeSelectDisabled(true)
      setContractorReference('')
    }
  }

  const getContractorsData = async (propertyReference, tradeCode) => {
    setLoadingContractors(true)
    setGetContractorsError(null)

    try {
      const contractors = await getContractors(propertyReference, tradeCode)

      setContractors(contractors)
      setContractorSelectDisabled(false)
    } catch (e) {
      setContractors([])
      setContractorReference('')
      console.log('An error has occured:', e.response)
      setGetContractorsError(
        `Oops an error occurred getting contractors with error status: ${e.response?.status}`
      )
    }

    setLoadingContractors(false)
  }

  const getSorCodesData = async (tradeCode, propertyRef, contractorRef) => {
    setLoadingSorCodes(true)
    setGetSorCodesError(null)

    try {
      const sorCodes = await getSorCodesByTradeAndContractor(
        tradeCode,
        propertyRef,
        contractorRef
      )

      setSorCodes(sorCodes)
      setSorCodeSelectDisabled(false)
    } catch (e) {
      setSorCodes([])
      console.log('An error has occured:', e.response)
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

      <ContractorSelect
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

      <SorCodeSelectView
        loading={loadingSorCodes}
        sorCodes={sorCodes}
        disabled={sorCodeSelectDisabled}
        register={register}
        errors={errors}
        isContractorUpdatePage={false}
        updatePriority={updatePriority}
        getPriorityObjectByCode={getPriorityObjectByCode}
        apiError={getSorCodesError}
      />
    </>
  )
}

TradeContractorSorCodeView.propTypes = {
  trades: PropTypes.array.isRequired,
  propertyReference: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  updatePriority: PropTypes.func.isRequired,
  getPriorityObjectByCode: PropTypes.func.isRequired,
}

export default TradeContractorSorCodeView
