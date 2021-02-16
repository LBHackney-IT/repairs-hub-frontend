import PropTypes from 'prop-types'
import cx from 'classnames'
import { useState } from 'react'
import { GridRow, GridColumn } from '../../Layout/Grid'
import { shortDayName, monthDay } from '../../../utils/date'
import { shortMonthName, longMonthName } from '../../../utils/date'
import { isBeginningOfMonth } from '../../../utils/date'
import { beginningOfDay, beginningOfWeek } from '../../../utils/time'
import { daysAfter, dateEqual } from '../../../utils/time'

const AppointmentCalendar = ({ availableAppointments }) => {
  const [selectedDate, setSelectedDate] = useState(null)

  const currentDate = beginningOfDay(new Date())
  const startOfCalendar = beginningOfWeek(currentDate)

  const dates = [0, 1, 2, 3, 4].map((week) =>
    [0, 1, 2, 3, 4, 5, 6].map((day) =>
      daysAfter(startOfCalendar, day + week * 7)
    )
  )

  const isToday = (date) => {
    return dateEqual(currentDate, date)
  }

  const isAvailable = (date) => {
    if (date > currentDate) {
      const reference = date.toISOString().substring(0, 19)
      const appointment = availableAppointments.find(
        (element) => element.date === reference
      )
      const slots = appointment && appointment.slots

      return !!(slots && slots.length > 0)
    } else {
      return false
    }
  }

  const isSelected = (date) => {
    return !!(selectedDate && dateEqual(date, selectedDate))
  }

  const selectDate = (event, date) => {
    event.preventDefault()

    if (isAvailable(date)) {
      setSelectedDate(date)
    }
  }

  return (
    <GridRow className="govuk-body-s">
      <GridColumn width="full">
        <div className="appointment-calendar">
          <table>
            <caption>
              <h2 className="govuk-heading-m govuk-!-margin-bottom-2">
                Confirm date and time
              </h2>
            </caption>
            <thead>
              <tr>
                <th colSpan="7">{longMonthName(currentDate)}</th>
              </tr>
              <tr>
                {dates[0].map((date, index) => (
                  <th key={index}>{shortDayName(date)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dates.map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.map((day, dayIndex) => (
                    <td
                      key={dayIndex}
                      onClick={(e) => {
                        selectDate(e, day)
                      }}
                    >
                      <div
                        className={cx({
                          current: isToday(day),
                          available: isAvailable(day),
                          selected: isSelected(day),
                        })}
                      >
                        <span className="date">{monthDay(day)}</span>
                        {isBeginningOfMonth(day) && !isToday(day) ? (
                          <span className="month">{shortMonthName(day)}</span>
                        ) : null}
                        {isToday(day) ? (
                          <span className="today">Today</span>
                        ) : null}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="legend">
            <li className="available">Available</li>
            <li className="unavailable">Unavailable</li>
          </ul>
        </div>
      </GridColumn>
    </GridRow>
  )
}

AppointmentCalendar.propTypes = {
  availableAppointments: PropTypes.array.isRequired,
}

export default AppointmentCalendar
