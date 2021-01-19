import PropTypes from 'prop-types'

const GridColumn = (props) => (
  <div className={`govuk-grid-column-${props.width}`}>{props.children}</div>
)

GridColumn.propTypes = {
  width: PropTypes.string.isRequired,
}

export default GridColumn
