import PropTypes from 'prop-types'

const FilterTag = ({ text, index, category, onFilterRemove }) => {
  const handleOnclick = (e) => {
    e.preventDefault()
    onFilterRemove(category, index)
  }

  return (
    <li className="filter-tag lbh-body-xs">
      <button
        type="button"
        aria-label={`Remove ${text} filter`}
        className="govuk-!-margin-left-1 filter-remove-button"
        onClick={handleOnclick}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 13 13"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M-0.0501709 1.36379L1.36404 -0.050415L12.6778 11.2633L11.2635 12.6775L-0.0501709 1.36379Z"
            fill="#0B0C0C"
          ></path>
          <path
            d="M11.2635 -0.050293L12.6778 1.36392L1.36404 12.6776L-0.0501709 11.2634L11.2635 -0.050293Z"
            fill="#0B0C0C"
          ></path>
        </svg>
      </button>
      {text}
    </li>
  )
}

FilterTag.propTypes = {
  text: PropTypes.string.isRequired,
  onFilterRemove: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
}

export default FilterTag
