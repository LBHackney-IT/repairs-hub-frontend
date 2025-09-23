import PropTypes from 'prop-types'
import cx from 'classnames'
import { useCallback, useState } from 'react'

const TruncateText = ({
  text,
  numberOfLines,
  pTagClassName,
  linkClassName,
  setIsExpanded,
  isExpanded,
}) => {
  const [textOverflow, setTextOverflow] = useState(false)

  const onShowMoreClick = (e) => {
    e.preventDefault()
    setIsExpanded(true)
  }

  const onShowLessClick = (e) => {
    e.preventDefault()
    setIsExpanded(false)
  }

  const pRef = useCallback((node) => {
    if (node != null) {
      if (node.scrollHeight > node.clientHeight + 1) {
        setTextOverflow(true)
      }
    }
  })

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

TruncateText.propTypes = {
  text: PropTypes.string.isRequired,
  numberOfLines: PropTypes.string.isRequired,
  pTagClassName: PropTypes.string,
  linkClassName: PropTypes.string,
  setIsExpanded: PropTypes.func,
  isExpanded: PropTypes.bool,
}

export default TruncateText
