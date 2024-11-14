import { beginningOfDay, daysBeforeDateRangeExcWeekend } from '@/utils/time'

interface PastWorkOrdersDatePickerProps {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const PastWorkOrdersDatePicker = ({
  handleChange,
}: PastWorkOrdersDatePickerProps) => {
  const currentDate = beginningOfDay(new Date())
  const lastSevenDays = daysBeforeDateRangeExcWeekend(currentDate, 7)

  return (
    <div className="date-picker-container">
      <label htmlFor="date-picker" className="lbh-heading-h2">
        Select date
      </label>
      <select id="date-picker" name="date-picker" onChange={handleChange}>
        {lastSevenDays.map((day, index) => {
          return (
            <option value={day} key={index}>
              {day.toString().slice(3, 10)}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default PastWorkOrdersDatePicker
