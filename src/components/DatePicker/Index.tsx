interface DatePickerProps {
  options: string[]
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const DatePicker = ({ options, handleChange }: DatePickerProps) => {
  return (
    <div className="date-picker-container">
      <label htmlFor="date-picker" className="lbh-heading-h2">
        Select date
      </label>
      <select id="date-picker" name="date-picker" onChange={handleChange}>
        {options.map((day, index) => {
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

export default DatePicker
