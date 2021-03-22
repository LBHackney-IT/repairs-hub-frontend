import PropTypes from 'prop-types'
import { Fragment, useState } from 'react'
import RateScheduleItem from '../../WorkElement/RateScheduleItem'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import Spinner from '../../Spinner/Spinner'
import { getSorCode } from '../../../utils/frontend-api-client/schedule-of-rates/codes'

const AddedRateScheduleItems = ({
  register,
  errors,
  addedTasks,
  isContractorUpdatePage,
  propertyReference,
}) => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [rateScheduleItems, setRateScheduleItems] = useState([...addedTasks])
  const [sorCodesList, setSorCodesList] = useState(
    addedTasks.map((item) => item.code)
  )
  const [nextFreeIndex, setNextFreeIndex] = useState(addedTasks.length)

  const addRateScheduleItem = () => {
    rateScheduleItems.push({ id: nextFreeIndex })
    setNextFreeIndex(nextFreeIndex + 1)
    setRateScheduleItems([...rateScheduleItems])
  }
  const removeRateScheduleItem = (index) => {
    let filtered = rateScheduleItems.filter((e) => e.id != index)
    setRateScheduleItems([...filtered])
  }

  const findRateScheduleItem = (index) => {
    return rateScheduleItems.find((e) => e.id === index)
  }

  const updateRateScheduleItem = (index, attribute, value) => {
    const rateScheduleItemAtSameIndex = findRateScheduleItem(index)
    const existingCode = rateScheduleItemAtSameIndex?.code === value

    if (rateScheduleItemAtSameIndex) {
      rateScheduleItemAtSameIndex[attribute] = value
    } else {
      setRateScheduleItems((rateScheduleItems) => [
        ...rateScheduleItems,
        {
          id: index,
          attribute: value,
        },
      ])
    }

    if (attribute === 'code' && value.length > 0 && !existingCode) {
      findSorCode(value, index)
    }
  }

  const findSorCode = async (sorCodeQuery, index) => {
    setLoading(true)
    setError(null)

    try {
      const sorCode = await getSorCode(sorCodeQuery, propertyReference)

      if (sorCode) {
        updateRateScheduleItem(index, 'description', sorCode.shortDescription)
        updateRateScheduleItem(index, 'cost', parseFloat(sorCode.cost))
        findRateScheduleItem(index).error = ''
        setSorCodesList([...new Set([...sorCodesList, sorCode.code])])
      }
    } catch (e) {
      console.error('An error has occured:', e.response)
      findRateScheduleItem(index).description = ''

      if (e.response?.status === 404) {
        updateRateScheduleItem(index, 'error', sorCodeQuery)
      } else {
        setError(
          `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
        )
      }
    }

    setLoading(false)
  }

  const showRateScheduleItems = (items) => {
    return items.map((item) => {
      return (
        <Fragment key={`rateScheduleItems~${item.id}`}>
          <RateScheduleItem
            code={item.code}
            description={item.description}
            hiddenDescriptionValue={true}
            quantity={item.quantity}
            cost={item.cost && parseFloat(item.cost)}
            register={register}
            errors={errors}
            key={item.id}
            index={item.id}
            showRemoveRateScheduleItem={isContractorUpdatePage}
            removeRateScheduleItem={removeRateScheduleItem}
            isContractorUpdatePage={isContractorUpdatePage}
            isTextInput={true}
            onBlur={() =>
              updateRateScheduleItem(item.id, 'code', event.target.value.trim())
            }
            onInputChange={() => {
              updateRateScheduleItem(
                item.id,
                'quantity',
                parseFloat(event.target.value)
              )
            }}
            sorCodesList={sorCodesList}
          />

          {item?.error && (
            <ErrorMessage
              id={item.id}
              label={`Could not find SOR code: ${item.error}`}
            />
          )}
        </Fragment>
      )
    })
  }

  return (
    <div className="govuk-!-padding-bottom-5">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {showRateScheduleItems(rateScheduleItems)}
          {error && <ErrorMessage label={error} />}
          <a
            onClick={addRateScheduleItem}
            href="#"
            className="repairs-hub-link govuk-body-s"
          >
            + Add another SOR code
          </a>
        </>
      )}
    </div>
  )
}

AddedRateScheduleItems.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  addedTasks: PropTypes.array.isRequired,
  isContractorUpdatePage: PropTypes.bool.isRequired,
  propertyReference: PropTypes.string.isRequired,
}

export default AddedRateScheduleItems
