import PropTypes from 'prop-types'
import RateScheduleItem from '../WorkElement/RateScheduleItem'
import { Fragment, useState } from 'react'

const AdditionalRateScheduleItem = ({
  register,
  errors,
  rateScheduleItems,
  isContractorUpdatePage,
}) => {
  const [
    additionalRateScheduleItems,
    setAdditionalRateScheduleItems,
  ] = useState([...rateScheduleItems])
  const [nextFreeIndex, setNextFreeIndex] = useState(rateScheduleItems.length)

  const removeRateScheduleItem = (index) => {
    let filtered = additionalRateScheduleItems.filter((e) => e.id != index)
    setAdditionalRateScheduleItems([...filtered])
  }

  const addRateScheduleItem = () => {
    additionalRateScheduleItems.push({ id: nextFreeIndex })
    setNextFreeIndex(nextFreeIndex + 1)
    setAdditionalRateScheduleItems([...additionalRateScheduleItems])
  }

  const showRateScheduleItems = (items) => {
    return items.map((item) => {
      return (
        <Fragment key={`rateScheduleItem~${item.id}`}>
          <RateScheduleItem
            code={item.code}
            quantity={item.quantity}
            cost={item.cost}
            register={register}
            errors={errors}
            key={item.id}
            index={item.id}
            showRemoveRateScheduleItem={isContractorUpdatePage}
            removeRateScheduleItem={removeRateScheduleItem}
            isContractorUpdatePage={isContractorUpdatePage}
            isTextInput={true}
          />
        </Fragment>
      )
    })
  }

  return (
    <div className="govuk-!-padding-bottom-5">
      {showRateScheduleItems(additionalRateScheduleItems)}
      <a
        onClick={addRateScheduleItem}
        href="#"
        className="repairs-hub-link govuk-body-s"
      >
        + Add another SOR code
      </a>
    </div>
  )
}

AdditionalRateScheduleItem.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isContractorUpdatePage: PropTypes.bool.isRequired,
  rateScheduleItems: PropTypes.array.isRequired,
}

export default AdditionalRateScheduleItem
