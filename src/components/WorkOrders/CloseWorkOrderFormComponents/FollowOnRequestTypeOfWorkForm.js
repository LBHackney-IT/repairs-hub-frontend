import classNames from 'classnames'
import { Radio, TextArea } from '../../Form'
import ErrorMessage from '../../Errors/ErrorMessage'
import FollowOnRequestDifferentTradesForm from './FollowOnRequestDifferentTradesForm'
import { FOLLOW_ON_REQUEST_AVAILABLE_TRADES } from '@/utils/statusCodes'
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

  const MULTIPLE_OPERATIVES_REQUIRED_OPTIONS = [
    {
      value: true,
      text: 'Yes',
      hint: null,
      defaultChecked: followOnData?.isMultipleOperatives === true,
    },
    {
      value: false,
      text: 'No',
      hint: null,
      defaultChecked: followOnData?.isMultipleOperatives === false,
    },
  ]

  return (
    <>
      <fieldset
        className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2 lbh-fieldset"
        style={{ marginTop: 0 }}
      >
        <div
          className={classNames('lbh-form-group', {
            'govuk-form-group--error': errors.typeOfWork,
          })}
        >
          <label className={`govuk-label govuk-label--m`}>
            Trades required
          </label>
          {errors.typeOfWork && (
            <div style={{ marginTop: 0, marginBlock: 10 }}>
              <ErrorMessage label={errors.typeOfWork.message} />
            </div>
          )}
          <FollowOnRequestDifferentTradesForm
            register={register}
            errors={errors}
            setErrors={setError}
            clearErrors={clearErrors}
            watch={watch}
            hasWhiteBackground={hasWhiteBackground}
            requiredFollowOnTrades={followOnData?.requiredFollowOnTrades ?? []}
            isGrid={isGrid}
            getValues={getValues}
          />
          <div style={{ marginTop: '3rem' }}>
            <Radio
              labelSize="s"
              label="Multiple operatives required"
              name="isMultipleOperatives"
              options={MULTIPLE_OPERATIVES_REQUIRED_OPTIONS}
              register={register({
                required: 'Please confirm if multiple operatives are required',
              })}
              error={errors && errors.isMultipleOperatives}
              hasWhiteBackground={hasWhiteBackground}
            />
          </div>
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
