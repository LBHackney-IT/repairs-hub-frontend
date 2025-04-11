import classNames from 'classnames'
import { FOLLOW_ON_REQUEST_AVAILABLE_TRADES } from '../../../utils/statusCodes'
import { Checkbox, TextArea } from '../../Form'
import ErrorMessage from '../../Errors/ErrorMessage'
import FollowOnRequestDifferentTradesForm from './FollowOnRequestDifferentTradesForm'
import { useEffect, useState } from 'react'

const FollowOnRequestTypeOfWorkForm = (props) => {
  const {
    errors,
    register,
    getValues,
    setError,
    clearErrors,
    watch,
    followOnData,
    hasWhiteBackground,
    isGrid,
  } = props

  const selectedFurtherWorkRequired =
    watch('followOnStatus') === 'furtherWorkRequired'

  const validateAtLeastOneOperativeOptionSelected = () => {
    if (!selectedFurtherWorkRequired) {
      clearErrors('typeOfWork')
      return
    }

    const fields = ['isSameTrade', 'isDifferentTrades', 'isMultipleOperatives']
    const isAnyChecked = fields.some((name) => getValues(name) === true)

    if (!isAnyChecked) {
      setError('typeOfWork', {
        type: 'manual',
        message: 'Please select the type of work',
      })
      return
    }

    clearErrors('typeOfWork')
  }

  // Watch all checkbox values
  const checkboxValues = watch(
    FOLLOW_ON_REQUEST_AVAILABLE_TRADES.map((x) => x.name)
  )

  const isDifferentTradesChecked = watch('isDifferentTrades')

  const [showDifferentTradesform, setShowDifferentTradesForm] = useState(false)

  useEffect(() => {
    // When navigating back from summary page, the watch hook isnt updating
    // meaning the followOnStatus options arent visible
    // this awful code fixes that

    if (isDifferentTradesChecked === undefined) {
      setShowDifferentTradesForm(followOnData?.isDifferentTrades ?? false)
    } else {
      setShowDifferentTradesForm(isDifferentTradesChecked)
    }
  }, [isDifferentTradesChecked])

  return (
    <>
      <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2 lbh-fieldset">
        <div
          className={classNames('lbh-form-group', {
            'govuk-form-group--error': errors.typeOfWork,
          })}
        >
          <label
            className={`govuk-label govuk-label--m`}
            htmlFor={name}
          >
            Type of work required
          </label>

          {errors.typeOfWork && (
            <div style={{ marginTop: 0, marginBlock: 10 }}>
              <ErrorMessage label={errors.typeOfWork.message} />
            </div>
          )}

          <Checkbox
            className="govuk-!-margin-0 govuk-!-margin-bottom-5"
            labelClassName="lbh-body-xs govuk-!-margin-0"
            name={'isSameTrade'}
            label={'Same trade'}
            register={register({
              validate: () => {
                // doesnt validate itself - just running the validate function
                // when the field updates
                validateAtLeastOneOperativeOptionSelected()

                return true
              },
            })}
            checked={followOnData?.isSameTrade ?? false}
            hasWhiteBackground={hasWhiteBackground}
          />

          <Checkbox
            className="govuk-!-margin-0 govuk-!-margin-bottom-5"
            labelClassName="lbh-body-xs govuk-!-margin-0"
            name={'isDifferentTrades'}
            label={'Different trade(s)'}
            error={errors && errors?.isDifferentTrades}
            checked={followOnData?.isDifferentTrades ?? false}
            hasWhiteBackground={hasWhiteBackground}
            register={register({
              validate: () => {
                // doesnt validate itself - just running the validate function
                // when the field updates
                validateAtLeastOneOperativeOptionSelected()

                if (!showDifferentTradesform) return true

                const isAnyChecked = Object.values(checkboxValues).some(
                  (value) => value === true
                )

                if (isAnyChecked) return true

                return 'Please select at least one trade'
              },
            })}
            children={
              <>
                {errors.isDifferentTrades && (
                  <ErrorMessage label={errors.isDifferentTrades?.message} />
                )}

                <FollowOnRequestDifferentTradesForm
                  register={register}
                  errors={errors}
                  watch={watch}
                  hasWhiteBackground={hasWhiteBackground}
                  requiredFollowOnTrades={
                    followOnData?.requiredFollowOnTrades ?? []
                  }
                  isGrid={isGrid}
                />
              </>
            }
            showChildren={showDifferentTradesform}
          />

          <Checkbox
            className="govuk-!-margin-0 govuk-!-margin-bottom-5"
            labelClassName="lbh-body-xs govuk-!-margin-0"
            name={'isMultipleOperatives'}
            checked={followOnData?.isMultipleOperatives ?? false}
            label={'Multiple operatives'}
            hasWhiteBackground={hasWhiteBackground}
            register={register({
              validate: () => {
                // doesnt validate itself - just running the validate function
                // when the field updates
                validateAtLeastOneOperativeOptionSelected()

                return true
              },
            })}
          />
        </div>
      </fieldset>

      <TextArea
        name="followOnTypeDescription"
        label="Describe work required"
        register={register({
          validate: (value) => {
            // prevent required error message from showing when this part of the form hasnt
            // been visible yet
            if (getValues('followOnStatus') !== 'furtherWorkRequired')
              return true

            if (!value) return 'Please provide detail of the work required'

            return true
          },
        })}
        error={errors && errors.followOnTypeDescription}
        defaultValue={followOnData?.followOnTypeDescription ?? ''}
      />
    </>
  )
}

export default FollowOnRequestTypeOfWorkForm
