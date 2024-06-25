import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import BackButton from '../Layout/BackButton'
import TextArea from '../Form/TextArea'
import Radios from '../Form/Radios'
import WarningInfoBox from '../Template/WarningInfoBox'
import {
  CLOSURE_STATUS_OPTIONS,
  FOLLOW_ON_STATUS_OPTIONS,
} from '@/utils/statusCodes'
import { Checkbox, PrimarySubmitButton } from '../Form'
import { useState } from 'react'
import DifferentTradesFurtherOptions from './DifferentTradesFurtherOptions'

const PAGES = {
  WORK_ORDER_STATUS: '1',
  FOLLOW_ON_DETAILS: '2',
}

const MobileWorkingCloseWorkOrderForm = ({ onSubmit }) => {
  const { handleSubmit, register, errors, watch } = useForm({
    // shouldUnregister: false,
  })

  const showFollowOnRadioOptions = watch('reason') === 'Work Order Completed'
  const selectedFurtherWorkRequired =
    watch('followOnStatus') === 'furtherWorkRequired'

  const newReasonOptions = CLOSURE_STATUS_OPTIONS.map((r) => {
    return {
      ...r,
      children:
        r.value === 'Work Order Completed' && showFollowOnRadioOptions ? (
          <Radios
            // label="Select reason for closing"
            name="followOnStatus"
            options={FOLLOW_ON_STATUS_OPTIONS}
            register={register({
              required: 'Please select a reason for closing the work order',
            })}
            error={errors && errors.reason}
          />
        ) : null,
    }
  })

  const [currentPage, setCurrentPage] = useState(PAGES.WORK_ORDER_STATUS)

  const viewFollowOnDetailsPage = () => {
    setCurrentPage(PAGES.FOLLOW_ON_DETAILS)
  }

  const viewWorkOrderStatusPage = () => {
    setCurrentPage(PAGES.WORK_ORDER_STATUS)
  }

  // const showChildrenDifferentTrades = watch('isDifferentTrades')

  return (
    <>
      <div>
        {/* if on second page, override back button */}
        <BackButton
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
              options={newReasonOptions}
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

            <div className="govuk-!-margin-top-8">
              <WarningInfoBox
                header="Other changes?"
                text="Any follow on and material change must be made on paper."
              />
            </div>

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

            <fieldset>
              <label className={`govuk-label govuk-label--m`} htmlFor={name}>
                Operatives
              </label>

              <Checkbox
                className="govuk-!-margin-0 govuk-!-margin-bottom-5"
                labelClassName="lbh-body-xs govuk-!-margin-0"
                name={'isSameTrade'}
                label={'Same trade'}
                register={register}
              />

              <Checkbox
                className="govuk-!-margin-0 govuk-!-margin-bottom-5"
                labelClassName="lbh-body-xs govuk-!-margin-0"
                name={'isDifferentTrades'}
                label={'Different trade(s)'}
                register={register}
                children={
                  <DifferentTradesFurtherOptions
                    register={register}
                    errors={errors}
                  />
                }
                showChildren={watch('isDifferentTrades')}
              />

              <Checkbox
                className="govuk-!-margin-0 govuk-!-margin-bottom-5"
                labelClassName="lbh-body-xs govuk-!-margin-0"
                name={'isMultipleOperatives'}
                label={'Multiple operatives'}
                register={register}
              />
            </fieldset>

            <TextArea
              name="followOnTypeDescription"
              label="Describe work required"
              register={register}
              error={errors && errors.notes}
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
              register={register}
              error={errors && errors.notes}
            />

            <TextArea
              name="additionalNotes"
              label="Additional notes"
              register={register}
              error={errors && errors.notes}
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
