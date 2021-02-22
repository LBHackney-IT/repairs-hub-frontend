import PropTypes from 'prop-types'
import RateScheduleItem from '../WorkElement/RateScheduleItem'
import { Fragment } from 'react'

const AdditionalRateScheduleItem = ({
  sorCodes,
  register,
  errors,
  rateScheduleItems,
  isContractorUpdatePage,
  addRateScheduleItem,
  removeRateScheduleItem,
}) => {
  const sorCodesList = sorCodes.map(
    (code) => `${code.code} - ${code.shortDescription}`
  )

  const additionalRateScheduleItems = (items) => {
    return items.map((item) => {
      return (
        <Fragment key={`rateScheduleItem~${item.id}`}>
          <RateScheduleItem
            code={item.code}
            quantity={item.quantity}
            cost={item.cost}
            sorCodesList={sorCodesList}
            register={register}
            errors={errors}
            key={item.id}
            index={item.id}
            showRemoveRateScheduleItem={isContractorUpdatePage}
            removeRateScheduleItem={removeRateScheduleItem}
            isContractorUpdatePage={isContractorUpdatePage}
          />
        </Fragment>
      )
    })
  }

  return (
    <div className="govuk-!-padding-bottom-5">
      {additionalRateScheduleItems(rateScheduleItems)}
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
  sorCodes: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isContractorUpdatePage: PropTypes.bool.isRequired,
  rateScheduleItems: PropTypes.array.isRequired,
}

export default AdditionalRateScheduleItem
