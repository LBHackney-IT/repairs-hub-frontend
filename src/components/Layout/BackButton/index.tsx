import { MouseEventHandler } from 'react'
import Router from 'next/router'

interface Props {
  onClick?: MouseEventHandler<HTMLAnchorElement> | null
}

const BackButton = ({ onClick = null }: Props) => (
  <a
    className="govuk-back-link lbh-back-link govuk-!-display-none-print"
    role="button"
    onClick={onClick === null ? () => Router.back() : onClick}
  >
    Back
  </a>
)

export default BackButton
