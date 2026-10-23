import { useRef, useState } from 'react'
import { Select } from '../../../Form'

interface Props {
  register: any
  errors: { [key: string]: { message: string } }
  formState?: { [key: string]: any }
}

export const NONE_OF_THE_ABOVE = 'none-of-the-above'
export const ADDITIONAL_REASON_PREFIX = 'additionalReasonForRepair'

const REASON_OPTIONS = [
  { text: 'Damp & Mould', value: 'damp-and-mould' },
  { text: 'Excess cold', value: 'excess-cold' },
  { text: 'Excess heat', value: 'excess-heat' },
  { text: 'Falls on the level', value: 'falls-on-the-level' },
  { text: 'Falling on stairs', value: 'falling-on-stairs' },
  { text: 'Falling between levels', value: 'falling-between-levels' },
  {
    text: 'Structural collapse and falling elements',
    value: 'structural-collapse-and-falling-elements',
  },
  { text: 'Fire and explosions', value: 'fire-and-explosions' },
  { text: 'Electrical hazards', value: 'electrical-hazards' },
  { text: 'Domestic hygiene', value: 'domestic-hygiene' },
]

const NONE_OPTION = { text: 'None of the above', value: NONE_OF_THE_ABOVE }

interface Row {
  id: number
  value: string
}

const fieldName = (id: number) =>
  id === 0 ? 'reasonForRepair' : `${ADDITIONAL_REASON_PREFIX}${id}`

// Restores previously entered rows, e.g. when returning from the multiple SORs page
const getInitialRows = (formState?: { [key: string]: any }): Row[] => {
  const additionalRows = Object.keys(formState || {})
    .filter((key) => new RegExp(`^${ADDITIONAL_REASON_PREFIX}\\d+$`).test(key))
    .map((key) => ({
      id: parseInt(key.replace(ADDITIONAL_REASON_PREFIX, '')),
      value: formState[key],
    }))
    .filter((row) => row.value)
    .sort((a, b) => a.id - b.id)

  return [{ id: 0, value: formState?.reasonForRepair || '' }, ...additionalRows]
}

export const RaiseWorkOrderReasonForRepair = (props: Props) => {
  const { register, errors, formState } = props

  const [rows, setRows] = useState<Row[]>(getInitialRows(formState))
  const nextId = useRef(Math.max(...rows.map((row) => row.id)) + 1)

  const lastValue = rows[rows.length - 1].value

  const canAddAnother =
    !!lastValue &&
    lastValue !== NONE_OF_THE_ABOVE &&
    rows.length < REASON_OPTIONS.length

  const onChange = (id: number, value: string) => {
    setRows((current) => {
      const index = current.findIndex((row) => row.id === id)
      // Picking "None of the above" is exclusive, so drop any further reasons
      const kept =
        value === NONE_OF_THE_ABOVE ? current.slice(0, index + 1) : current

      return kept.map((row) => (row.id === id ? { ...row, value } : row))
    })
  }

  const optionsFor = (id: number) => {
    // A reason can only be chosen once, and "None of the above" only on its own
    const takenElsewhere = rows
      .filter((row) => row.id !== id)
      .map((row) => row.value)
    const options = REASON_OPTIONS.filter(
      (option) => !takenElsewhere.includes(option.value)
    )

    return id === 0 ? [...options, NONE_OPTION] : options
  }

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
          <div key={name} className="reason-for-repair__row">
            <Select
              name={name}
              label="Reason"
              options={optionsFor(id)}
              required={true}
              register={register({
                required: 'Please select an option',
              })}
              error={errors && errors[name]}
              widthClass="govuk-!-width-full"
              onChange={(e) => onChange(id, e.target.value)}
              hint={undefined}
              children={undefined}
              ignoreValue={undefined}
              defaultValue={undefined}
              value={undefined}
              disabled={undefined}
            />
            {/* Reserves the same space on the first row so all dropdowns match */}
            <div className="reason-for-repair__action">
              {id !== 0 && (
                <a
                  className="lbh-link"
                  href="#"
                  data-testid={`remove-${name}-link`}
                  onClick={(e) => {
                    e.preventDefault()
                    setRows((current) => current.filter((row) => row.id !== id))
                  }}
                >
                  Remove
                </a>
              )}
            </div>
          </div>
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
              setRows((current) => [
                ...current,
                { id: nextId.current++, value: '' },
              ])
            }}
          >
            + Add another reason
          </a>
        </p>
      )}
    </div>
  )
}
