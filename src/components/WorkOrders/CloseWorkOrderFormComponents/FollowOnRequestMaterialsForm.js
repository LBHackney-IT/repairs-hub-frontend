import { Checkbox, TextArea } from '../../Form'

const FollowOnRequestMaterialsForm = (props) => {
  const { register, getValues, errors, followOnData, hasWhiteBackground } =
    props

  return (
    <>
      <fieldset>
        <label className={`govuk-label govuk-label--m`}>Materials</label>

        <Checkbox
          className="govuk-!-margin-0"
          labelClassName="lbh-body-xs govuk-!-margin-0 govuk-!-margin-bottom-5"
          name={'stockItemsRequired'}
          label={'Stock items required'}
          register={register}
          checked={followOnData?.stockItemsRequired ?? false}
          hasWhiteBackground={hasWhiteBackground}
        />

        <Checkbox
          className="govuk-!-margin-0"
          labelClassName="lbh-body-xs govuk-!-margin-0 govuk-!-margin-bottom-5"
          name={'nonStockItemsRequired'}
          label={'Non stock items required'}
          register={register}
          checked={followOnData?.nonStockItemsRequired ?? false}
          hasWhiteBackground={hasWhiteBackground}
        />
      </fieldset>

      <TextArea
        name="materialNotes"
        label="Materials required"
        defaultValue={followOnData?.materialNotes ?? ''}
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
    </>
  )
}

export default FollowOnRequestMaterialsForm
