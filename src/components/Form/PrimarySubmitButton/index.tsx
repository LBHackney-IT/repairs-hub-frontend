import Button, { Props as ButtonProps } from '../Button'

const PrimarySubmitButton = ({
  onClick,
  label,
  ...otherProps
}: Omit<ButtonProps, 'type'>) => (
  <div className="govuk-form-group lbh-form-group">
    <Button
      type={'submit'}
      onClick={onClick}
      label={label}
      {...otherProps}
    ></Button>
  </div>
)

export default PrimarySubmitButton
