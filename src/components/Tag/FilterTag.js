import PropTypes from 'prop-types'

const FilterTag = ({ text, index, category, onFilterRemove }) => {
  const handleOnclick = () => {
    onFilterRemove(category, index)
  }

  return (
    <li>
      <a className="lbh-body-xs filter-tag" onClick={handleOnclick}>
        {text}&nbsp;&nbsp;&nbsp;X
      </a>
    </li>
  )
}

FilterTag.propTypes = {
  text: PropTypes.string.isRequired,
}

export default FilterTag
