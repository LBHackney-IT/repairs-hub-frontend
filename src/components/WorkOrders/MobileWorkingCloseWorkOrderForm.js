import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import BackButton from '../Layout/BackButton'
import TextArea from '../Form/TextArea'
import Radios from '../Form/Radios'
import {
  CLOSURE_STATUS_OPTIONS,
  FOLLOW_ON_REQUEST_AVAILABLE_TRADES,
  FOLLOW_ON_STATUS_OPTIONS,
} from '@/utils/statusCodes'
import { Checkbox, PrimarySubmitButton } from '../Form'
import { useState } from 'react'
import DifferentTradesFurtherOptions from './DifferentTradesFurtherOptions'
import ErrorMessage from '../Errors/ErrorMessage'
import classNames from 'classnames'

const PAGES = {
  WORK_ORDER_STATUS: '1',
  FOLLOW_ON_DETAILS: '2',
}

const MobileWorkingCloseWorkOrderForm = ({ onSubmit }) => {
  const {
    handleSubmit,
    register,
    errors,
    setError,
    clearErrors,
    watch,
    getValues,
  } = useForm({
    shouldUnregister: false,
  })

  const showFollowOnRadioOptions = watch('reason') === 'Work Order Completed'
  const selectedFurtherWorkRequired =
    watch('followOnStatus') === 'furtherWorkRequired'

  const [currentPage, setCurrentPage] = useState(PAGES.WORK_ORDER_STATUS)

  const viewFollowOnDetailsPage = () => {
    setCurrentPage(PAGES.FOLLOW_ON_DETAILS)
  }

  const viewWorkOrderStatusPage = () => {
    setCurrentPage(PAGES.WORK_ORDER_STATUS)
  }

  // Watch all checkbox values
  const checkboxValues = watch(
    FOLLOW_ON_REQUEST_AVAILABLE_TRADES.map((x) => x.name)
  )

  const isDifferentTradesChecked = watch('isDifferentTrades')

  const validateAtLeastOneOperativeOptionSelected = () => {
    if (!selectedFurtherWorkRequired) {
      clearErrors('medium')
      return
    }

    const fields = ['isSameTrade', 'isDifferentTrades', 'isMultipleOperatives']
    const isAnyChecked = fields.some((name) => getValues(name) === true)

    if (!isAnyChecked) {
      setError('medium', {
        type: 'manual',
        message: 'Please select the type of work',
      })
      return
    }

    clearErrors('medium')
  }

  return (
    <>
      <div>
        <BackButton
          // if on second page, override back button
          onClick={
            currentPage === PAGES.FOLLOW_ON_DETAILS
              ? viewWorkOrderStatusPage
              : null
          }
        />

        <form role="form" onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              display:
                currentPage === PAGES.WORK_ORDER_STATUS ? 'block' : 'none',
            }}
          >
            <h1 className="lbh-heading-h2">Close work order form</h1>

            <Radios
              labelSize="s"
              label="Select reason for closing"
              name="reason"
              options={CLOSURE_STATUS_OPTIONS.map((r) => ({
                ...r,
                children:
                  r.value === 'Work Order Completed' &&
                  showFollowOnRadioOptions ? (
                    <Radios
                      name="followOnStatus"
                      options={FOLLOW_ON_STATUS_OPTIONS}
                      register={register({
                        required: 'Please confirm if further work is required',
                      })}
                      error={errors && errors.followOnStatus}
                    />
                  ) : null,
              }))}
              register={register({
                required: 'Please select a reason for closing the work order',
              })}
              error={errors && errors.reason}
            />

            <TextArea
              name="notes"
              label="Final report"
              register={register}
              error={errors && errors.notes}
            />

            {selectedFurtherWorkRequired ? (
              <PrimarySubmitButton
                label="Add details"
                type="button"
                onClick={viewFollowOnDetailsPage}
              />
            ) : (
              <PrimarySubmitButton label={`Close work order`} />
            )}
          </div>

          <div
            style={{
              display:
                currentPage === PAGES.FOLLOW_ON_DETAILS ? 'block' : 'none',
            }}
          >
            <h1 className="lbh-heading-h2">Details of further work required</h1>

            <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2 lbh-fieldset">
              <div
                className={classNames('lbh-form-group', {
                  'govuk-form-group--error': errors.medium,
                })}
              >
                <label className={`govuk-label govuk-label--m`} htmlFor={name}>
                  Type of work required
                </label>

                {errors.medium && (
                  <div style={{ marginTop: 0, marginBlock: 10 }}>
                    <ErrorMessage label={errors.medium.message} />
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
                />

                <Checkbox
                  className="govuk-!-margin-0 govuk-!-margin-bottom-5"
                  labelClassName="lbh-body-xs govuk-!-margin-0"
                  name={'isDifferentTrades'}
                  label={'Different trade(s)'}
                  error={errors && errors?.isDifferentTrades}
                  register={register({
                    validate: () => {
                      // doesnt validate itself - just running the validate function
                      // when the field updates
                      validateAtLeastOneOperativeOptionSelected()

                      if (!isDifferentTradesChecked) return true

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
                        <ErrorMessage
                          label={errors.isDifferentTrades?.message}
                        />
                      )}

                      <DifferentTradesFurtherOptions
                        register={register}
                        errors={errors}
                      />
                    </>
                  }
                  showChildren={isDifferentTradesChecked}
                />

                <Checkbox
                  className="govuk-!-margin-0 govuk-!-margin-bottom-5"
                  labelClassName="lbh-body-xs govuk-!-margin-0"
                  name={'isMultipleOperatives'}
                  label={'Multiple operatives'}
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

                  if (!value) return 'Please describe the work completed'

                  return true
                },
              })}
              error={errors && errors.followOnTypeDescription}
            />

            <fieldset>
              <label className={`govuk-label govuk-label--m`} htmlFor={name}>
                Materials
              </label>

              <Checkbox
                className="govuk-!-margin-0"
                labelClassName="lbh-body-xs govuk-!-margin-0 govuk-!-margin-bottom-5"
                name={'stockItemsRequired'}
                label={'Stock items required'}
                register={register}
              />

              <Checkbox
                className="govuk-!-margin-0"
                labelClassName="lbh-body-xs govuk-!-margin-0 govuk-!-margin-bottom-5"
                name={'nonStockItemsRequired'}
                label={'Non stock items required'}
                register={register}
              />
            </fieldset>

            <TextArea
              name="materialNotes"
              label="Materials required"
              register={register({
                validate: (value) => {
                  // neither checkbox checked, not required
                  if (
                    !getValues('nonStockItemsRequired') &&
                    !getValues('stockItemsRequired')
                  ) {
                    return true
                  }

                  if (value.length >= 1) return true

                  return 'Please describe the materials required'
                },
              })}
              error={errors && errors.materialNotes}
            />

            <TextArea
              name="additionalNotes"
              label="Additional notes"
              register={register}
              error={errors && errors.additionalNotes}
            />

            <PrimarySubmitButton label="Close work order" />
          </div>
        </form>
      </div>
    </>
  )
}

MobileWorkingCloseWorkOrderForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default MobileWorkingCloseWorkOrderForm
