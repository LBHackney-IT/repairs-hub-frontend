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
  setValue,
  setPageToMultipleSORs,
}) => {
  const [rateScheduleItems, setRateScheduleItems] = useState([...addedTasks])
  const [nextFreeIndex, setNextFreeIndex] = useState(addedTasks.length)
  const [rateScheduleItemSorCodeArray, setRateScheduleItemSorCodeArray] = useState([])
  useEffect(() => {
    console.log("USEEFFECT")
    console.log(rateScheduleItems)
    console.log(sorCodeArrays)


    const scheduleItem_SorCodeArray = rateScheduleItems.map((item, index) => {
      const validSorCodeArray = sorCodeArrays.find(el => el.length == 1 && el[0].code == item.code)

      return {
        rateScheduleItem: item,
        sorCodeArrays: validSorCodeArray ? validSorCodeArray : sorCodeArrays[0]
      }
    });

    setRateScheduleItemSorCodeArray(scheduleItem_SorCodeArray);
    
  }, [rateScheduleItems,sorCodeArrays])

  const addRateScheduleItem = (e) => {
    e.preventDefault()
    rateScheduleItems.push({ id: nextFreeIndex })
    setNextFreeIndex(nextFreeIndex + 1)
    setRateScheduleItems([...rateScheduleItems])

    console.log(`Pushing item with id: ${nextFreeIndex}`)
    console.log(rateScheduleItems)

   // const newSorArray = []
    const newSorArray = sorSearchRequest
      ? [] // will be populated on user input
      : sorCodeArrays[sorCodeArrays.length - 1] // each additional SOR will have the same options

    
    // if (sorCodeArrays[sorCodeArrays.length - 1].length < 2) {
    //   sorCodeArrays[sorCodeArrays.length  -1] = sorCodeArrays[0]
    // }
    console.log('ADDING')
    console.log(newSorArray)
    console.log([...sorCodeArrays, newSorArray])
    setSorCodeArrays((sorCodeArrays) => [...sorCodeArrays, newSorArray])
  }

  const removeRateScheduleItem = (index) => {
    console.log("LEAVING AFTER DELETING")

    console.log(rateScheduleItemSorCodeArray)
    console.log(rateScheduleItems)

    const filtered = rateScheduleItemSorCodeArray.filter(el => el.rateScheduleItem.id != index)
    setRateScheduleItemSorCodeArray([...filtered])
    
    console.log(filtered)
    const filtered2 = rateScheduleItems.filter(el => el.id != index);
    console.log(filtered2)

    setRateScheduleItems([...filtered2])
    setSorCodeArrays((sorCodeArrays) => {
        sorCodeArrays.splice(index, 1)
        console.log(sorCodeArrays)
        return sorCodeArrays
      })
      
    // console.log('REMOVE')
    // let filtered = rateScheduleItems.filter((e) => e.id != index)
    // setRateScheduleItems([...filtered])

    // setSorCodeArrays((sorCodeArrays) => {
    //   sorCodeArrays.splice(index, 1)
    //   console.log(sorCodeArrays)
    //   return sorCodeArrays
    // })
  }

  const findRateScheduleItem = (index) => {
    const found = rateScheduleItems.find((e) => e.id === index)

    console.log(`Found ${JSON.stringify(found)}`)

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
    console.log(`Added tasks ${JSON.stringify(addedTasks)}`)
    console.log(items)
    return items.map((item, index) => {
      console.log(`Item ${JSON.stringify(item)} with index ${index}`)
      console.log(sorCodeArrays[index])
      console.log(rateScheduleItemSorCodeArray)
      const element = rateScheduleItemSorCodeArray.find(el => el.rateScheduleItem.id == item.id);
      console.log(element)
      return (
        <Fragment key={`rateScheduleItems~${item.id}`}>
          <RateScheduleItem
            sorCodes={(element && element.sorCodeArrays) || (sorCodeArrays[0] || [])}
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
                console.log(`SORCODEARRAYS ${sorCodeArrays}`)
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

  return (
    <div className="govuk-!-padding-bottom-5">
      {showRateScheduleItems(rateScheduleItems)}

      <a className="lbh-link" href="#" onClick={addRateScheduleItem}>
        + Add another SOR code
      </a>
    </div>
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
