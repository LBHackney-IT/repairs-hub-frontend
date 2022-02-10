import PropTypes from 'prop-types'
import { useState } from 'react'
import RateScheduleItemView from './RateScheduleItemView'
import TradeDataList from '../../WorkElement/TradeDataList'
import ContractorDataList from './ContractorDataList'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import axios from 'axios'

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
  const [loadingContractors, setLoadingContractors] = useState(false)
  const [loadingSorCodes, setLoadingSorCodes] = useState(false)
  const [tradeCode, setTradeCode] = useState('')
  const [contractors, setContractors] = useState([])
  const [contractorReference, setContractorReference] = useState('')
  const [sorCodes, setSorCodes] = useState([])
  const [contractorSelectDisabled, setContractorSelectDisabled] = useState(true)
  const [rateScheduleItemDisabled, setRateScheduleItemDisabled] = useState(true)

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
      setRateScheduleItemDisabled(true)
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

  const getSorCodesData = async (tradeCode, propertyRef, contractorRef) => {
    console.log(tradeCode, propertyRef, contractorRef)

    setLoadingSorCodes(true)
    setGetSorCodesError(null)

    try {
      // const sorCodes = await frontEndApiRequest({
      //   method: 'get',
      //   path: '/api/schedule-of-rates/codes',
      //   params: {
      //     tradeCode: tradeCode,
      //     propertyReference: propertyRef,
      //     contractorReference: contractorRef,
      //     isRaisable: true,
      //   },
      // })

      const { data: sorCodes } = await axios({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/photos',
      })

      const longListSorCodes = [
        sorCodes,
        sorCodes,
        sorCodes,
        sorCodes,
        sorCodes,
        sorCodes,
        sorCodes,
        sorCodes,
        sorCodes,
        sorCodes,
      ]
        .flat()
        .map((sor, index) => {
          return {
            ...sor,
            id: index,
          }
        })

      setSorCodes(longListSorCodes)

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
