interface Props {
  title: string
  workOrderReference: string
  dateSelected?: string
  slot?: string
  comments?: string
  authorisationText?: string
}

export const Panel = ({
  title,
  workOrderReference,
  dateSelected,
  slot,
  comments,
  authorisationText,
}: Props) => (
  <div className="govuk-panel govuk-panel--confirmation lbh-panel">
    <h1 className="govuk-panel__title govuk-!-margin-bottom-1">
      {title} {authorisationText}
    </h1>
    <div className="govuk-panel__body govuk-!-margin-top-0">
      <p>Reference number {workOrderReference}</p>

      {dateSelected && (
        <p>
          {dateSelected} {`${slot && slot.split(' ')[0]}`}
        </p>
      )}
      {comments && <p className="govuk-!-margin-top-1">Comments: {comments}</p>}
    </div>
  </div>
)

export default Panel
