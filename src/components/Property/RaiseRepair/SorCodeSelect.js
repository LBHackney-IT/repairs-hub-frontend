import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../../Layout/Grid'
import { Select, TextInput } from '../../Form'

const SorCodeSelect = ({
  onSorCodeSelect,
  sorCodesList,
  register,
  errors,
  index,
  showRemoveSorCodeSelect,
  removeSorCodeSelect,
}) => {
  return (
    <GridRow
      className="sor-code-select display-flex align-items-center position-relative"
      id={`sor-code-select-${index}`}
    >
      <GridColumn width="two-thirds">
        <Select
          name={`sorCodesCollection[${index}][code]`}
          label="SOR Code"
          options={sorCodesList}
          onChange={(event) => onSorCodeSelect(index, event)}
          required={true}
          register={register({
            required: 'Please select an SOR code',
            validate: (value) =>
              sorCodesList.includes(value) || 'SOR code is not valid',
          })}
          error={errors && errors.sorCodesCollection?.[`${index}`]?.code}
          widthClass="govuk-!-width-full"
        />
        <input
          id={`sorCodesCollection[${index}][description]`}
          name={`sorCodesCollection[${index}][description]`}
          type="hidden"
          ref={register}
        />
        <input
          id={`sorCodesCollection[${index}][contractorRef]`}
          name={`sorCodesCollection[${index}][contractorRef]`}
          type="hidden"
          ref={register}
        />
      </GridColumn>
      <GridColumn width="one-third">
        <TextInput
          name={`sorCodesCollection[${index}][quantity]`}
          label="Quantity"
          error={errors && errors.sorCodesCollection?.[`${index}`]?.quantity}
          widthClass="govuk-!-width-full"
          required={true}
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

      {showRemoveSorCodeSelect && (
        <div className="remove-sor-code position-absolute right-negative-3">
          <button
            id={`remove-sor-code-${index}`}
            className="cursor-pointer"
            type="button"
            onClick={() => removeSorCodeSelect(index)}
          >
            -
          </button>
        </div>
      )}
    </GridRow>
  )
}

SorCodeSelect.propTypes = {
  onSorCodeSelect: PropTypes.func.isRequired,
  sorCodesList: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  showRemoveSorCodeSelect: PropTypes.bool.isRequired,
  removeSorCodeSelect: PropTypes.func.isRequired,
}

export default SorCodeSelect
