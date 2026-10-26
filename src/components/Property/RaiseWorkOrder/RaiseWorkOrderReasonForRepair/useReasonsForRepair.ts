import { useRef, useState } from 'react'

const NONE_OF_THE_ABOVE = 'none-of-the-above'
const ADDITIONAL_REASON_PREFIX = 'additionalReasonForRepair'

export const FIRST_ROW_ID = 0

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

// The first row keeps the original field name, the rest are numbered by id.
// The request builder reads these same names, see raiseWorkOrderForm.ts
const fieldName = (id: number) =>
  id === FIRST_ROW_ID ? 'reasonForRepair' : `${ADDITIONAL_REASON_PREFIX}${id}`

// Matches the field names above, capturing the row id e.g. additionalReasonForRepair3
const ADDITIONAL_FIELD_PATTERN = new RegExp(
  `^${ADDITIONAL_REASON_PREFIX}(\\d+)$`
)

// The saved form state holds one entry per field, e.g. when returning from the
// multiple SORs page. Turn those entries back into rows.
const getInitialRows = (formState: { [key: string]: any } = {}): Row[] => {
  const firstRow = { id: FIRST_ROW_ID, value: formState.reasonForRepair || '' }

  const additionalRows = Object.entries(formState)
    .map(([fieldName, value]) => ({
      match: fieldName.match(ADDITIONAL_FIELD_PATTERN),
      value,
    }))
    // Ignore other fields and rows that were left blank
    .filter(({ match, value }) => match && value)
    .map(({ match, value }) => ({ id: Number(match[1]), value }))
    // Field order isn't guaranteed, and ids can be missing e.g. 1, 3, 10
    .sort((a, b) => a.id - b.id)

  return [firstRow, ...additionalRows]
}

// The dropdowns themselves are uncontrolled (registered with the form), the
// values are mirrored here so each row can hide the reasons already chosen by
// the others and we know when another row can be added.
export const useReasonsForRepair = (formState?: { [key: string]: any }) => {
  const [rows, setRows] = useState<Row[]>(() => getInitialRows(formState))
  const nextId = useRef(Math.max(...rows.map((row) => row.id)) + 1)

  const lastValue = rows[rows.length - 1].value
  const allReasonsUsed = rows.length >= REASON_OPTIONS.length

  const canAddAnother =
    !!lastValue && lastValue !== NONE_OF_THE_ABOVE && !allReasonsUsed

  const addRow = () => {
    const id = nextId.current++
    setRows((current) => [...current, { id, value: '' }])
  }

  const removeRow = (id: number) =>
    setRows((current) => current.filter((row) => row.id !== id))

  const selectReason = (id: number, value: string) =>
    setRows((current) => {
      const index = current.findIndex((row) => row.id === id)
      // Picking "None of the above" is exclusive, so drop any further reasons
      const kept =
        value === NONE_OF_THE_ABOVE ? current.slice(0, index + 1) : current

      return kept.map((row) => (row.id === id ? { ...row, value } : row))
    })

  // A reason can only be chosen once, and "None of the above" only on its own
  const optionsFor = (id: number) => {
    const takenElsewhere = rows
      .filter((row) => row.id !== id)
      .map((row) => row.value)
    const options = REASON_OPTIONS.filter(
      (option) => !takenElsewhere.includes(option.value)
    )

    return id === FIRST_ROW_ID ? [...options, NONE_OPTION] : options
  }

  return {
    rows,
    fieldName,
    optionsFor,
    canAddAnother,
    addRow,
    removeRow,
    selectReason,
  }
}
