import cx from 'classnames'
import { MouseEvent, useState } from 'react'

interface Props {
  text: string
  numberOfLines: string
  pTagClassName?: string
  linkClassName?: string
  setIsExpanded?: (isExpanded: boolean) => void
  isExpanded?: boolean
}

const TruncateText = ({
  text,
  numberOfLines,
  pTagClassName,
  linkClassName,
  setIsExpanded,
  isExpanded,
}: Props) => {
  const [textOverflow, setTextOverflow] = useState(false)

  const onShowMoreClick = (e: MouseEvent) => {
    e.preventDefault()
    setIsExpanded(true)
  }

  const onShowLessClick = (e: MouseEvent) => {
    e.preventDefault()
    setIsExpanded(false)
  }

  const pRef = (node: HTMLParagraphElement | null) => {
    if (node != null) {
      if (node.scrollHeight > node.clientHeight + 1) {
        setTextOverflow(true)
      }
    }
  }

  return (
    <>
      <p
        ref={pRef}
        className={cx(
          pTagClassName ? pTagClassName : '',
          isExpanded
            ? ''
            : `truncate-description truncate-line-${numberOfLines}`
        )}
      >
        {text}
      </p>
      {textOverflow ? (
        !isExpanded ? (
          <a
            className={cx('lbh-link', linkClassName ? linkClassName : '')}
            href="#"
            onClick={onShowMoreClick}
          >
            show more
          </a>
        ) : (
          <a
            className={cx('lbh-link', linkClassName ? linkClassName : '')}
            href="#"
            onClick={onShowLessClick}
          >
            show less
          </a>
        )
      ) : (
        ''
      )}
    </>
  )
}

export default TruncateText
