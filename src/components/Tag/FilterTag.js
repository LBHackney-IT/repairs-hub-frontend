import PropTypes from 'prop-types'

const FilterTag = ({ text }) => {
  return (
    <li>
      <a className="lbh-body-xs filter-tag">{text}</a>
    </li>
  )
}

FilterTag.propTypes = {
  text: PropTypes.string.isRequired,
}

export default FilterTag
