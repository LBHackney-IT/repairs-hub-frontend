const GridRow = (props) => (
  <div
    className={`govuk-grid-row ${props.className}`}
    id={props.id}
  >
    {props.children}
  </div>
)

export default GridRow
