import PropTypes from 'prop-types'
import { DataList } from '../../Form'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { formatBudgetCodeForOption } from '@/utils/helpers/budgetCodes'

const BudgetCodeItemView = ({
  budgetCodeId,
  setBudgetCodeId,
  register,
  errors,
  disabled,
  budgetCodes,
  loading,
  apiError,
  afterValidBudgetCodeSelected,
}) => {
  const budgetCodeOptions = budgetCodes.map((code) =>
    formatBudgetCodeForOption(code)
  )

  const budgetCodesWithOptions = budgetCodes.map((code, index) => ({
    ...code,
    optionText: budgetCodeOptions[index],
  }))

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
            options={budgetCodeOptions}
            required={true}
            disabled={disabled}
            onChange={(event) => {
              const budgetName = event.target.value
              const budgetCode = budgetCodesWithOptions.find(
                (code) => code.optionText === budgetName
              )

              if (budgetCode) {
                setBudgetCodeId(budgetCode.id)
                afterValidBudgetCodeSelected()
              }
            }}
            register={register({
              required: 'Please select a budget code',
              validate: (value) =>
                budgetCodesWithOptions.some(
                  (code) => code.optionText === value
                ) || 'Budget code is not valid',
            })}
            error={errors && errors.budgetCode}
            widthClass="govuk-!-width-one-half"
          />
          {apiError && <ErrorMessage label={apiError} />}
        </>
      )}

      <input
        id="budgetCodeId"
        name="budgetCodeId"
        type="hidden"
        ref={register}
        value={budgetCodeId}
      />
    </div>
  )
}

BudgetCodeItemView.propTypes = {
  budgetCodeId: PropTypes.string.isRequired,
  setBudgetCodeId: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  budgetCodes: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  apiError: PropTypes.string,
  afterValidBudgetCodeSelected: PropTypes.func.isRequired,
}

export default BudgetCodeItemView
