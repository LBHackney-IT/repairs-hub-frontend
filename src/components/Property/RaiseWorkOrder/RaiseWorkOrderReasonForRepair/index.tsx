import { ReasonForRepairRow } from './ReasonForRepairRow'
import { FIRST_ROW_ID, useReasonsForRepair } from './useReasonsForRepair'

interface Props {
  register: any
  errors: { [key: string]: { message: string } }
  formState?: { [key: string]: any }
}

export const RaiseWorkOrderReasonForRepair = (props: Props) => {
  const { register, errors, formState } = props

  const {
    rows,
    fieldName,
    optionsFor,
    canAddAnother,
    addRow,
    removeRow,
    selectReason,
  } = useReasonsForRepair(formState)

  return (
    <div className="reason-for-repair">
      <h3 className="lbh-heading-h3">
        Reason for this repair
        <span className="govuk-caption-m">
          Is the repair related to the following?
        </span>
      </h3>

      {rows.map(({ id }) => {
        const name = fieldName(id)

        return (
          <ReasonForRepairRow
            key={name}
            name={name}
            options={optionsFor(id)}
            register={register}
            error={errors && errors[name]}
            onChange={(value) => selectReason(id, value)}
            onRemove={id === FIRST_ROW_ID ? undefined : () => removeRow(id)}
          />
        )
      })}

      {canAddAnother && (
        <p className="lbh-body-m">
          <a
            className="lbh-link"
            href="#"
            data-testid="add-another-reason-for-repair-link"
            onClick={(e) => {
              e.preventDefault()
              addRow()
            }}
          >
            + Add another reason
          </a>
        </p>
      )}
    </div>
  )
}
