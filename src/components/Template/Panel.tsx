interface Props {
  title: string
  workOrderReference: string
  dateSelected?: string
  slot?: string
  comments?: string
  authorisationText?: string
}

export const Panel = (props: Props) => (
  <div className="govuk-panel govuk-panel--confirmation lbh-panel">
    <h1 className="govuk-panel__title govuk-!-margin-bottom-1">
      {props.title} {props.authorisationText}
    </h1>
    <div className="govuk-panel__body govuk-!-margin-top-0">
      <p>Reference number {props.workOrderReference}</p>

      {props.dateSelected && (
        <p>
          {props.dateSelected} {`${props.slot && props.slot.split(' ')[0]}`}
        </p>
      )}
      {props.comments && (
        <p className="govuk-!-margin-top-1">Comments: {props.comments}</p>
      )}
    </div>
  </div>
)

export default Panel
