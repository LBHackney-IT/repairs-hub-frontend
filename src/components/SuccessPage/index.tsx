import Link from 'next/link'
import WarningText from '../Template/WarningText'

interface Props {
  links: {
    href: string
    text: string
    rel?: string
    target?: string
    onClick?: () => void
  }[]
  banner: any
  warningText?: string
}

const SuccessPage = (props: Props) => {
  const { links, banner, warningText } = props

  return (
    <>
      {banner}
      {warningText && <WarningText text={warningText} />}
      <ul className="lbh-list lbh-!-margin-top-9">
        {links.map((link, i) => {
          return (
            <li key={i}>
              <Link href={link.href}>
                <a
                  className="lbh-link"
                  onClick={link.onClick}
                  target={link.target}
                  rel={link.rel}
                >
                  {link.text}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default SuccessPage
