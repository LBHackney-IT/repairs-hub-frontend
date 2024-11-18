import { format } from 'date-fns'
import { getWorkingDaysBeforeDate } from '@/utils/time'

interface PastWorkOrdersDatePickerProps {
  currentDate: Date
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const PastWorkOrdersDatePicker = ({
  currentDate,
  handleChange,
}: PastWorkOrdersDatePickerProps) => {
  const lastSevenDays = getWorkingDaysBeforeDate(currentDate, 7)

  return (
    <div className="date-picker-container">
      <label htmlFor="date-picker" className="lbh-heading-h2">
        Select date
      </label>
      <select id="date-picker" name="date-picker" onChange={handleChange}>
        {lastSevenDays.map((day, index) => {
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
