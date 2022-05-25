import PropTypes from 'prop-types'
import Link from 'next/link'
import WarningText from '../Template/WarningText'

const SuccessPage = ({ ...props }) => {
  return (
    <>
      {props.banner}
      {props.warningText && <WarningText text={props.warningText} />}
      <ul className="lbh-list lbh-!-margin-top-9">
        {props.links.map((link, i) => {
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

SuccessPage.propTypes = {
  links: PropTypes.array.isRequired,
  banner: PropTypes.any,
  warningText: PropTypes.string,
}

export default SuccessPage
