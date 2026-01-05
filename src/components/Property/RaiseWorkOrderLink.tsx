import Link from 'next/link'

interface Props {
  title: string
  description: string
  url: string
}

const RaiseWorkOrderLink = (props: Props) => {
  const { title, description, url } = props

  return (
    <Link href={url} legacyBehavior>
      <a className="lbh-body raiseWorkOrderLink">
        <div className="raiseWorkOrderLink-container">
          <div>
            <div className="lbh-heading-h3 raiseWorkOrderLink-title">
              {title}
            </div>
            <div className="raiseWorkOrderLink-description">{description}</div>
          </div>

          <div className="govuk-!-margin-0">
            <span className="arrow right raiseWorkOrderLink-arrow-icon" />
          </div>
        </div>
      </a>
    </Link>
  )
}

export default RaiseWorkOrderLink
