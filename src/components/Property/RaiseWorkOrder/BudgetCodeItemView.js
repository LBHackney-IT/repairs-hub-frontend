import PropTypes from 'prop-types'
import { DataList } from '../../Form'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'

const BudgetCodeItemView = ({
  register,
  errors,
  disabled,
  budgetCodes,
  loading,
  apiError,
  onBudgetSelect,
}) => {
  return (
    <div className="min-height-100">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <DataList
            name="budgetCode"
            label="Budget code"
            labelMessage="- Search by code"
            options={budgetCodes}
            required={true}
            disabled={disabled}
            onChange={onBudgetSelect}
            register={register({
              required: 'Please select a budget code',
              validate: (value) =>
                budgetCodes.includes(value) || 'Budget code is not valid',
            })}
            error={errors && errors.budgetCode}
            widthClass="govuk-!-width-one-half"
          />
          {apiError && <ErrorMessage label={apiError} />}
        </>
      )}
    </div>
  )
}

BudgetCodeItemView.PropTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  budgetCodes: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  apiError: PropTypes.string,
  onBudgetSelect: PropTypes.func.isRequired,
}

export default BudgetCodeItemView
