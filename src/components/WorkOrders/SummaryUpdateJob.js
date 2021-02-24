import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'

const SummaryUpdateJob = ({
  reference,
  onJobSubmit,
  task,
  sorCodesCollection,
  changeStep,
}) => {
  const { handleSubmit } = useForm({})

  const tableData = (data) => {
    return data.map((t, index) => (
      <tr className={`task-${index} govuk-table__row`} key={index}>
        <th
          scope="row"
          className={` sor-code-${index} govuk-table__header`}
          key={t.code}
        >
          {t.code}
        </th>
        <td className={`quantity-${index} govuk-table__cell`} key={t.quantity}>
          {t.quantity}
        </td>
        <td className={`edit-${index} govuk-table__cell`} key={`edit-${index}`}>
          <a onClick={changeStep} href="#">
            Edit
          </a>
        </td>
      </tr>
    ))
  }

  return (
    <div>
      <h1 className="govuk-heading-l">Update work order: {reference}</h1>
      <form
        role="form"
        id="repair-request-form"
        onSubmit={handleSubmit(onJobSubmit)}
      >
        <p className="govuk-heading-s">Summary of updates to work order</p>
        <p className="govuk-heading-s">Tasks and SORs</p>
        <table className="govuk-table">
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th scope="col" className="govuk-table__header">
                SOR code
              </th>
              <th scope="col" className="govuk-table__header">
                Quantity
              </th>
              <th scope="col" className="govuk-table__header">
                {''}
              </th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {tableData(task)}
            {sorCodesCollection ? tableData(sorCodesCollection) : ''}
          </tbody>
        </table>
        <PrimarySubmitButton label="Confirm and close" />
      </form>
    </div>
  )
}

SummaryUpdateJob.propTypes = {
  reference: PropTypes.string.isRequired,
  onJobSubmit: PropTypes.func.isRequired,
  sorCodesCollection: PropTypes.array,
  changeStep: PropTypes.func.isRequired,
}

export default SummaryUpdateJob
