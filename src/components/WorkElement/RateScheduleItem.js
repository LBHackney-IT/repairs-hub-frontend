import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../Layout/Grid'
import { Select, TextInput } from '../Form'

const RateScheduleItem = ({
  onRateScheduleItemSelect,
  sorCodesList,
  register,
  errors,
  index,
  showRemoveRateScheduleItem,
  removeRateScheduleItem,
  code,
  quantity,
  disabled,
}) => {
  return (
    <GridRow
      className="rate-schedule-item display-flex align-items-center position-relative"
      id={`rate-schedule-item-${index}`}
    >
      <GridColumn width="two-thirds">
        <Select
          name={`rateScheduleItems[${index}][code]`}
          label="SOR Code"
          options={sorCodesList}
          defaultValue={code ?? ''}
          disabled={disabled}
          onChange={(event) =>
            onRateScheduleItemSelect && onRateScheduleItemSelect(index, event)
          }
          required={true}
          selected={code ?? ''}
          register={register({
            required: 'Please select an SOR code',
            validate: (value) =>
              sorCodesList.includes(value) || 'SOR code is not valid',
          })}
          error={errors && errors.rateScheduleItems?.[`${index}`]?.code}
          widthClass="govuk-!-width-full"
        />
        <input
          id={`rateScheduleItems[${index}][description]`}
          name={`rateScheduleItems[${index}][description]`}
          type="hidden"
          ref={register}
        />
      </GridColumn>
      <GridColumn width="one-third">
        <TextInput
          name={`rateScheduleItems[${index}][quantity]`}
          label="Quantity"
          error={errors && errors.rateScheduleItems?.[`${index}`]?.quantity}
          widthClass="govuk-!-width-full"
          required={true}
          defaultValue={quantity ? quantity : ''}
          disabled={disabled}
          register={register({
            required: 'Please enter a quantity',
            valueAsNumber: true,
            validate: (value) => {
              if (!Number.isInteger(value)) {
                return 'Quantity must be a whole number'
              }
              if (value < 1) {
                return 'Quantity must be 1 or more'
              } else if (value > 50) {
                return 'Quantity must be 50 or less'
              } else {
                return true
              }
            },
          })}
        />
      </GridColumn>

      {showRemoveRateScheduleItem && (
        <div className="remove-rate-schedule-item position-absolute right-negative-3">
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
    </GridRow>
  )
}

RateScheduleItem.propTypes = {
  onRateScheduleItemSelect: PropTypes.func,
  sorCodesList: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  index: PropTypes.number,
  showRemoveRateScheduleItem: PropTypes.bool.isRequired,
  removeRateScheduleItem: PropTypes.func.isRequired,
  code: PropTypes.string,
  quantity: PropTypes.number,
  cost: PropTypes.number,
  disabled: PropTypes.bool,
}

export default RateScheduleItem
