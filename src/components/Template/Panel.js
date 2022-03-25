import PropTypes from 'prop-types'

export const Panel = (props) => (
  <div className="govuk-panel govuk-panel--confirmation lbh-panel">
    <h1 className="govuk-panel__title">{props.title}</h1>
    <div className="govuk-panel__body">
      <p>Reference number</p>
      <strong className="govuk-!-font-size-41">
        {props.workOrderReference}
      </strong>

      {props.dateSelected && (
        <strong className="govuk-!-font-size-36">
          <br />
          <br />
          {props.dateSelected}
        </strong>
      )}

      {props.slot && (
        <strong className="govuk-!-font-size-36">
          <br />
          {props.slot.split(' ')[0]}
        </strong>
      )}
      {props.comments && (
        <p>
          <br />
          Comments: {props.comments}
        </p>
      )}
    </div>
  </div>
)

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  workOrderReference: PropTypes.string.isRequired,
  dateSelected: PropTypes.string,
  slot: PropTypes.string,
  comments: PropTypes.string,
}

export default Panel
