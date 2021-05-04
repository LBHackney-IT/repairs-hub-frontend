import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../Layout/Grid'
import { Select, TextInput } from '../Form'

const RateScheduleItem = ({
  onChange,
  sorCodesList,
  register,
  errors,
  index,
  showRemoveRateScheduleItem,
  removeRateScheduleItem,
  code,
  quantity,
  disabled,
  isTextInput,
  onBlur,
  onInputChange,
  description,
  hiddenDescriptionValue,
  cost,
}) => {
  let FormComponent = isTextInput ? TextInput : Select

  return (
    <>
      <GridRow
        className="rate-schedule-item display-flex align-items-center position-relative"
        id={`rate-schedule-item-${index}`}
      >
        <GridColumn width="two-thirds">
          <FormComponent
            name={`rateScheduleItems[${index}][code]`}
            label="SOR Code"
            options={sorCodesList}
            defaultValue={code ?? ''}
            disabled={disabled}
            onChange={(event) => onChange && onChange(index, event)}
            onBlur={(event) => onBlur && onBlur(index, event)}
            required={true}
            selected={code ?? ''}
            register={register({
              required: isTextInput
                ? 'Please enter an SOR code'
                : 'Please select an SOR code',
              validate: (value) => {
                if (!sorCodesList.includes(value)) {
                  return 'SOR code is not valid'
                }
              },
            })}
            error={errors && errors.rateScheduleItems?.[`${index}`]?.code}
            widthClass="govuk-!-width-full"
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
        </GridColumn>
        <GridColumn width="one-third">
          <TextInput
            name={`rateScheduleItems[${index}][quantity]`}
            label="Quantity"
            error={errors && errors.rateScheduleItems?.[`${index}`]?.quantity}
            widthClass="govuk-!-width-full"
            required={true}
            defaultValue={quantity ?? ''}
            onChange={(event) => onInputChange && onInputChange(index, event)}
            disabled={disabled}
            register={register({
              required: 'Please enter a quantity',
              validate: (value) => {
                const maxTwoDecimalPoints = /^(?=.*\d)\d*(?:\.\d{1,2})?$/
                if (isNaN(value)) {
                  return 'Quantity must be a number'
                } else if (value <= 0) {
                  return 'Quantity must be 0 or more'
                } else if (!maxTwoDecimalPoints.test(value)) {
                  return 'Quantity including a decimal point is permitted a maximum of 2 decimal places'
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

      {description && (
        <div className="sor-code-summary">
          <p className="govuk-body-s">SOR code summary: {description}</p>
        </div>
      )}
    </>
  )
}

RateScheduleItem.propTypes = {
  sorCodesList: PropTypes.array,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  index: PropTypes.number,
  showRemoveRateScheduleItem: PropTypes.bool.isRequired,
  removeRateScheduleItem: PropTypes.func.isRequired,
  code: PropTypes.string,
  quantity: PropTypes.number,
  description: PropTypes.string,
  cost: PropTypes.number,
  disabled: PropTypes.bool,
  isTextInput: PropTypes.bool,
}

export default RateScheduleItem
