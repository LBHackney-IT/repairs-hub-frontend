import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'

const SummaryCloseJob = ({
  reference,
  onJobSubmit,
  notes,
  time,
  date,
  changeStep,
}) => {
  const { handleSubmit } = useForm({})

  return (
    <div>
      <h1 className="lbh-heading-l">Update work order: {reference}</h1>
      <form role="form" onSubmit={handleSubmit(onJobSubmit)}>
        <p className="lbh-heading-h4">Summary of updates to work order</p>
        <table className="govuk-table">
          <tbody className="govuk-table__body">
            <tr className="govuk-table__row">
              <th scope="row" className="govuk-table__header">
                Completion time
              </th>
              <td className="govuk-table__cell">
                {date.split('-').join('/')} {time}
              </td>
              <td className="govuk-table__cell">
                <a onClick={changeStep} href="#">
                  Edit
                </a>
              </td>
            </tr>
            <tr className="govuk-table__row">
              <th scope="row" className="govuk-table__header">
                Notes
              </th>
              <td className="govuk-table__cell">{notes}</td>
              <td className="govuk-table__cell">
                <a onClick={changeStep} href="#">
                  Edit
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <PrimarySubmitButton label="Confirm and close" />
      </form>
    </div>
  )
}

SummaryCloseJob.propTypes = {
  reference: PropTypes.string.isRequired,
  onJobSubmit: PropTypes.func.isRequired,
  notes: PropTypes.string.isRequired,
  time: PropTypes.string,
  date: PropTypes.string,
  changeStep: PropTypes.func.isRequired,
}

export default SummaryCloseJob
