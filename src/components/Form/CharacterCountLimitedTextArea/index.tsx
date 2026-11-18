import TextArea from '../TextArea'
import { useState, KeyboardEvent } from 'react'
import { UseFormMethods } from 'react-hook-form'

interface Props {
  label: string
  name: string
  register: UseFormMethods['register']
  requiredText: string
  maxLength: number
  currentLength?: number
  [key: string]: any
}

const CharacterCountLimitedTextArea = ({
  register,
  requiredText,
  maxLength,
  currentLength = maxLength,
  ...otherProps
}: Props) => {
  const [remainingCharacterCount, setRemainingCharacterCount] = useState(
    currentLength
  )

  return (
    <>
      <TextArea
        onKeyUp={(e: KeyboardEvent<HTMLTextAreaElement>) =>
          setRemainingCharacterCount(maxLength - e.currentTarget.value.length)
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

export default CharacterCountLimitedTextArea
