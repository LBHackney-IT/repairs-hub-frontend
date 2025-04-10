import PropTypes from 'prop-types'
import { Fragment, useState } from 'react'
import RateScheduleItem from '../../WorkElement/RateScheduleItem'
import ErrorMessage from '../../Errors/ErrorMessage'
import { useEffect } from 'react'

const AddedRateScheduleItems = ({
  register,
  errors,
  addedTasks,
  isContractorUpdatePage,
  sorSearchRequest,
  sorCodeArrays,
  setSorCodeArrays,
  setPageToMultipleSORs,
}) => {
  const [rateScheduleItems, setRateScheduleItems] = useState([...addedTasks])
  const [nextFreeIndex, setNextFreeIndex] = useState(addedTasks.length)
  const [rateScheduleItemSorCodeArray, setRateScheduleItemSorCodeArray] =
    useState([])
  useEffect(() => {
    let scheduleItem_SorCodeArray = rateScheduleItems.map((item, index) => {
      const validSorCodeArray = sorCodeArrays.find(
        (el) => el.length == 1 && el[0].code == item.code
      )
      return {
        rateScheduleItem: item,
        sorCodeArrays: validSorCodeArray
          ? validSorCodeArray
          : sorSearchRequest
          ? sorCodeArrays[index]
          : sorCodeArrays[0],
      }
    })

    setRateScheduleItemSorCodeArray(scheduleItem_SorCodeArray)
  }, [rateScheduleItems, sorCodeArrays])

  const addRateScheduleItem = (e) => {
    e.preventDefault()
    rateScheduleItems.push({ id: nextFreeIndex })
    setNextFreeIndex(nextFreeIndex + 1)
    setRateScheduleItems([...rateScheduleItems])

    const newSorArray = sorSearchRequest
      ? [] // will be populated on user input
      : sorCodeArrays[sorCodeArrays.length - 1] // each additional SOR will have the same options

    setSorCodeArrays((sorCodeArrays) => [...sorCodeArrays, newSorArray])
  }

  const removeRateScheduleItem = (index) => {
    const filtered = rateScheduleItemSorCodeArray.filter(
      (el) => el.rateScheduleItem.id != index
    )
    setRateScheduleItemSorCodeArray([...filtered])

    const filtered2 = rateScheduleItems.filter((el) => el.id != index)

    setRateScheduleItems([...filtered2])
    setSorCodeArrays((sorCodeArrays) => {
      sorCodeArrays.splice(index, 1)
      return sorCodeArrays
    })
  }

  const findRateScheduleItem = (index) => {
    const found = rateScheduleItems.find((e) => e.id === index)
    return found
  }

  const updateRateScheduleItem = (index, attribute, value) => {
    const rateScheduleItemAtSameIndex = findRateScheduleItem(index)
    const existingCode = rateScheduleItemAtSameIndex?.code === value

    if (rateScheduleItemAtSameIndex) {
      rateScheduleItemAtSameIndex[attribute] = value
      setRateScheduleItems([...rateScheduleItems])
    } else {
      setRateScheduleItems((rateScheduleItems) => [
        ...rateScheduleItems,
        {
          id: index,
          attribute: value,
        },
      ])
    }

    if (attribute === 'code' && value?.length > 0 && !existingCode) {
      findSorCode(value.toUpperCase(), index)
    }
  }

  const findSorCode = (sorCodeQuery, index) => {
    const sorCode = sorCodeArrays[index].find((code) => {
      return code.code === sorCodeQuery
    })

    if (sorCode) {
      updateRateScheduleItem(index, 'description', sorCode.shortDescription)
      updateRateScheduleItem(index, 'cost', parseFloat(sorCode.cost))
      findRateScheduleItem(index).error = ''
    }
  }

  const showRateScheduleItems = (items) => {
    return items.map((item, index) => {
      const element = rateScheduleItemSorCodeArray.find(
        (el) => el.rateScheduleItem.id == item.id
      )
      return (
        <Fragment key={`rateScheduleItems~${item.id}`}>
          <RateScheduleItem
            sorCodes={
              (element && element.sorCodeArrays) || sorCodeArrays[0] || []
            }
            register={register}
            errors={errors}
            key={item.id}
            index={(element && element.rateScheduleItem.id) || item.id}
            description={item.description}
            quantity={item.quantity}
            cost={item.cost && parseFloat(item.cost)}
            showRemoveRateScheduleItem={isContractorUpdatePage}
            removeRateScheduleItem={removeRateScheduleItem}
            isContractorUpdatePage={isContractorUpdatePage}
            onRateScheduleItemChange={(index, code) => {
              updateRateScheduleItem(item.id, 'code', code)
            }}
            onQuantityChange={() => {
              updateRateScheduleItem(
                item.id,
                'quantity',
                parseFloat(event.target.value)
              )
            }}
            {...(item.code && { code: `${item.code} - ${item.description}` })}
            sorSearchRequest={sorSearchRequest}
            setSorCodes={(sorCodes) => {
              setSorCodeArrays((sorCodeArrays) => {
                return [
                  ...sorCodeArrays.slice(0, index),
                  sorCodes,
                  ...sorCodeArrays.slice(index + 1),
                ]
              })
            }}
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

  const changePageView = (e) => {
    e.preventDefault()
    setPageToMultipleSORs()
  }

  return (
    <>
      <div>{showRateScheduleItems(rateScheduleItems)}</div>
      <div>
        <a className="lbh-link" href="#" onClick={addRateScheduleItem}>
          + Add another SOR code
        </a>
      </div>
      <div>
        <a className="lbh-link" href="#" onClick={changePageView}>
          + Add multiple SOR codes
        </a>
      </div>
    </>
  )
}

AddedRateScheduleItems.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  addedTasks: PropTypes.array.isRequired,
  isContractorUpdatePage: PropTypes.bool.isRequired,
  sorCodeArrays: PropTypes.array.isRequired,
  setSorCodeArrays: PropTypes.func.isRequired,
}

export default AddedRateScheduleItems
