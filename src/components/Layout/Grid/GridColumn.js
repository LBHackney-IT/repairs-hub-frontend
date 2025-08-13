import PropTypes from 'prop-types'

const GridColumn = (props) => {
  let className = props.className
    ? `govuk-grid-column-${props.width} ${props.className}`
    : `govuk-grid-column-${props.width}`

  return <div className={className}>{props.children}</div>
}

GridColumn.propTypes = {
  width: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
}

export default GridColumn
