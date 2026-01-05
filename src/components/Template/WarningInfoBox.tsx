import cn from 'classnames'
import { JSX } from 'react'

interface Props {
  header: string
  text?: string | JSX.Element
  className?: string
  name?: string
  style?: object
}

const WarningInfoBox = (props: Props) => {
  const { header, text, name, className, style } = props

  return (
    <div
      className={cn(
        'warning-info-box govuk-inset-text lbh-inset-text',
        className
      )}
      style={style}
      data-testid={name}
    >
      <div className="lbh-warning-text govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">
          !
        </span>
        <div className="govuk-warning-text__text">
          <span className="govuk-warning-text__assistive">Warning</span>
          <p className="govuk-!-margin-top-0 lbh-body-s lbh-!-font-weight-bold">
            {header}
          </p>
          <p className="lbh-body-xs govuk-!-margin-top-1">{text}</p>
        </div>
      </div>
    </div>
  )
}

export default WarningInfoBox
