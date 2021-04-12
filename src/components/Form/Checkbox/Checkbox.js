import cx from 'classnames'
import PropTypes from 'prop-types'

const Checkbox = ({ label, name, register, error, checked }) => (
  <div
    className={cx('govuk-form-group lbh-form-group', {
      'govuk-form-group--error': error,
    })}
  >
    <div className="govuk-checkboxes lbh-checkboxes">
      <div className="govuk-checkboxes__item">
        <input
          className="govuk-checkboxes__input"
          className={cx('govuk-checkboxes__input', {
            'govuk-input--error': error,
          })}
          id={name}
          name={name}
          type="checkbox"
          ref={register}
          {...(checked && { defaultChecked: checked })}
        />
        <label className="govuk-label govuk-checkboxes__label" htmlFor={name}>
          {label}
        </label>
      </div>
    </div>
  </div>
)

Checkbox.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  error: PropTypes.shape({ message: PropTypes.string.isRequired }),
}

export default Checkbox
