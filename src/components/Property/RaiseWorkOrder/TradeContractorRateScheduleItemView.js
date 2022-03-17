import PropTypes from 'prop-types'
import { useState } from 'react'
import RateScheduleItemView from './RateScheduleItemView'
import TradeDataList from '../../WorkElement/TradeDataList'
import ContractorDataList from './ContractorDataList'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

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
  const [loadingContractors, setLoadingContractors] = useState(false)
  const [tradeCode, setTradeCode] = useState('')
  const [contractors, setContractors] = useState([])
  const [contractorReference, setContractorReference] = useState('')
  const [contractorSelectDisabled, setContractorSelectDisabled] = useState(true)
  const [rateScheduleItemDisabled, setRateScheduleItemDisabled] = useState(true)

  const [sorCodeArrays, setSorCodeArrays] = useState([[]])

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

    if (newTradeCode?.length) {
      setTradeCode(newTradeCode)

      resetSORs()

      getContractorsData(propertyReference, newTradeCode)
    } else {
      setContractorSelectDisabled(true)
      setRateScheduleItemDisabled(true)
      setContractors([])
      setTradeCode('')
    }
  }

  const onContractorSelect = (event) => {
    const contractorName = event.target.value.split(' - ')[0]
    const contractorRef = contractors.filter(
      (contractor) => contractor.contractorName === contractorName
    )[0]?.contractorReference

    if (contractorRef?.length) {
      setContractorReference(contractorRef)
      resetSORs()
      setRateScheduleItemDisabled(false)
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

  const sorSearchRequest = (searchText) =>
    frontEndApiRequest({
      method: 'get',
      path: '/api/schedule-of-rates/codes',
      params: {
        tradeCode: tradeCode,
        propertyReference: propertyReference,
        contractorReference: contractorReference,
        isRaisable: true,
        q: searchText,
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

      <RateScheduleItemView
        disabled={rateScheduleItemDisabled}
        register={register}
        errors={errors}
        isContractorUpdatePage={false}
        updatePriority={updatePriority}
        getPriorityObjectByCode={getPriorityObjectByCode}
        setTotalCost={setTotalCost}
        sorCodeArrays={sorCodeArrays}
        setSorCodeArrays={setSorCodeArrays}
        sorSearchRequest={sorSearchRequest}
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
