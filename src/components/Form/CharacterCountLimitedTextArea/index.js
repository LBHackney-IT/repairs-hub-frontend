import PropTypes from 'prop-types'
import TextArea from '../TextArea'
import { useState } from 'react'

const CharacterCountLimitedTextArea = ({
  register,
  requiredText,
  maxLength,
  currentLength = maxLength,
  ...otherProps
}) => {
  const [remainingCharacterCount, setRemainingCharacterCount] =
    useState(currentLength)

  return (
    <>
      <TextArea
        onKeyUp={(e) =>
          setRemainingCharacterCount(maxLength - e.target.value.length)
        }
        register={register({
          required: requiredText,
          maxLength: {
            value: maxLength,
            message: 'You have exceeded the maximum amount of characters',
          },
        })}
        {...otherProps}
      />
      <span
        className="govuk-hint govuk-character-count__message"
        aria-live="polite"
      >
        You have {remainingCharacterCount} characters remaining.
      </span>
    </>
  )
}

CharacterCountLimitedTextArea.propTypes = {
  register: PropTypes.func.isRequired,
  requiredText: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
}

export default CharacterCountLimitedTextArea
