import PropTypes from 'prop-types'
import { DataList } from '../../Form'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { formatBudgetCode } from '@/utils/helpers/budgetCodes'
import { useState } from 'react'

const BudgetCodeItemView = ({
  register,
  errors,
  disabled,
  budgetCodes,
  loading,
  apiError,
  afterValidBudgetCodeSelected,
  afterInvalidBudgetCodeSelected,
}) => {
  const [budgetCodeSelected, setBudgetCodeSelected] = useState()
  const budgetCodeOptions = budgetCodes.map((code) => formatBudgetCode(code))

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
                setBudgetCodeSelected(budgetCode)
                afterValidBudgetCodeSelected()
              } else {
                afterInvalidBudgetCodeSelected()
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
        value={budgetCodeSelected?.id}
      />
    </div>
  )
}

BudgetCodeItemView.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  budgetCodes: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  apiError: PropTypes.string,
  afterValidBudgetCodeSelected: PropTypes.func.isRequired,
  afterInvalidBudgetCodeSelected: PropTypes.func.isRequired,
}

export default BudgetCodeItemView
