import PropTypes from 'prop-types'
import { DataList, TextInput } from '../Form'

const RateScheduleItem = ({
  sorCodesList,
  onRateScheduleItemChange,
  register,
  errors,
  index,
  showRemoveRateScheduleItem,
  removeRateScheduleItem,
  code,
  quantity,
  disabled,
  onQuantityChange,
  description,
  hiddenDescriptionValue,
  cost,
}) => {
  return (
    <>
      <div className="rate-schedule-item govuk-!-margin-top-0">
        <DataList
          name={`rateScheduleItems[${index}][code]`}
          label="SOR Code"
          labelMessage="- Search by code or description"
          options={sorCodesList}
          defaultValue={code ?? ''}
          disabled={disabled}
          onChange={(event) =>
            onRateScheduleItemChange && onRateScheduleItemChange(index, event)
          }
          required={true}
          selected={code ?? ''}
          register={register({
            required: 'Please select an SOR code',
            validate: (value) =>
              sorCodesList.includes(value) || 'SOR code is not valid',
          })}
          error={errors && errors.rateScheduleItems?.[`${index}`]?.code}
          widthClass="govuk-!-margin-top-0 govuk-!-width-full"
          additionalDivClasses="rate-schedule-item--sor-code"
        />

        <input
          id={`rateScheduleItems[${index}][description]`}
          name={`rateScheduleItems[${index}][description]`}
          {...(hiddenDescriptionValue && { value: description ?? '' })}
          type="hidden"
          ref={register}
        />

        <input
          id={`rateScheduleItems[${index}][cost]`}
          name={`rateScheduleItems[${index}][cost]`}
          {...(cost && { value: cost ?? '' })}
          type="hidden"
          ref={register}
        />

        <TextInput
          name={`rateScheduleItems[${index}][quantity]`}
          label="Quantity"
          error={errors && errors.rateScheduleItems?.[`${index}`]?.quantity}
          widthClass="govuk-!-width-full"
          required={true}
          defaultValue={quantity ?? ''}
          additionalDivClasses="rate-schedule-item--quantity"
          onChange={(event) =>
            onQuantityChange && onQuantityChange(index, event)
          }
          disabled={disabled}
          register={register({
            required: 'Please enter a quantity',
            validate: (value) => {
              const maxTwoDecimalPoints = /^(?=.*\d)\d*(?:\.\d{1,2})?$/
              if (isNaN(value)) {
                return 'Quantity must be a number'
              } else if (value <= 0) {
                return 'Quantity must be greater than 0'
              } else if (!maxTwoDecimalPoints.test(value)) {
                return 'Quantity including a decimal point is permitted a maximum of 2 decimal places'
              } else {
                return true
              }
            },
          })}
        />

        {showRemoveRateScheduleItem && (
          <div className="remove-rate-schedule-item govuk-!-margin-0">
            <button
              id={`remove-rate-schedule-item-${index}`}
              className="cursor-pointer"
              type="button"
              onClick={() => removeRateScheduleItem(index)}
            >
              -
            </button>
          </div>
        )}
      </div>
    </>
  )
}

RateScheduleItem.propTypes = {
  sorCodesList: PropTypes.array,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  index: PropTypes.number,
  showRemoveRateScheduleItem: PropTypes.bool.isRequired,
  removeRateScheduleItem: PropTypes.func,
  code: PropTypes.string,
  quantity: PropTypes.number,
  description: PropTypes.string,
  cost: PropTypes.number,
  disabled: PropTypes.bool,
  onQuantityChange: PropTypes.func,
  onRateScheduleItemChange: PropTypes.func,
}

export default RateScheduleItem
