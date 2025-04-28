import cx from 'classnames'
import { convertToSentenceCases } from '@/utils/helpers/textConverter'

interface Props {
  text: string
  className?: string
}

const Status = ({ text, className }: Props) => (
  <span
    className={cx(
      `govuk-tag lbh-tag lbh-tag--status-${text
        .replace(/\s+/g, '-')
        .toLowerCase()}`,
      className
    )}
  >
    {convertToSentenceCases(text)}
  </span>
)

export default Status
