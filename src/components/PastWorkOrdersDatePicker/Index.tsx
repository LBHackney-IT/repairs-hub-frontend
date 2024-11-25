import { format } from 'date-fns'
import { getWorkingDaysBeforeDate } from '@/utils/time'

interface PastWorkOrdersDatePickerProps {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  lastFiveWorkingDays: Date[] | string[]
}

const PastWorkOrdersDatePicker = ({
  handleChange,
  lastFiveWorkingDays,
}: PastWorkOrdersDatePickerProps) => {
  return (
    <div className="date-picker-container">
      <label htmlFor="date-picker" className="lbh-heading-h2">
        Select date
      </label>
      <select id="date-picker" name="date-picker" onChange={handleChange}>
        {lastFiveWorkingDays.map((day, index) => {
          const formattedDate = format(day, 'MMM dd')
          return (
            <option data-testid={`date-option`} value={day} key={index}>
              {formattedDate}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default PastWorkOrdersDatePicker