const Button = ({ onClick, label, type, ...otherProps }) => (
  <div className="govuk-form-group">
    <button
      className="govuk-button"
      data-module="govuk-button"
      onClick={onClick}
      type={type}
      {...otherProps}
    >
      {label}
    </button>
  </div>
);

export default Button
