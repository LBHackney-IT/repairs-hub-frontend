import cx from 'classnames'
import { JSX, useEffect } from 'react'
import Editor from 'react-simple-code-editor'
import ErrorMessage from '@/components/Errors/ErrorMessage'

interface Props {
  name: string
  label: string
  hint?: string
  value: string
  onValueChange: (value: string) => void
  invalidLines: Set<number>
  placeholder?: string
  error?: { message: string | JSX.Element }
}

const SorCodeEditor = (props: Props) => {
  const {
    name,
    label,
    hint,
    value,
    onValueChange,
    invalidLines,
    placeholder,
    error,
  } = props

  const hasError = Boolean(error)

  // react-simple-code-editor doesn't let us pass attributes to its textarea
  useEffect(() => {
    const textarea = document.getElementById(name)

    textarea?.setAttribute(
      'aria-describedby',
      [hint && `${name}-hint`, hasError && `${name}-error`]
        .filter(Boolean)
        .join(' ')
    )
    textarea?.setAttribute('aria-invalid', String(hasError))
  }, [name, hint, hasError])

  const highlight = (text: string) => {
    const isPlaceholder = text === '' && Boolean(placeholder)

    return (isPlaceholder ? placeholder : text)
      .split('\n')
      .map((line, index, lines) => {
        const isInvalid = !isPlaceholder && invalidLines.has(index + 1)

        return (
          <span key={index}>
            <span
              className={cx('sor-code-editor__line', {
                'sor-code-editor__line--invalid': isInvalid,
                'sor-code-editor__line--placeholder': isPlaceholder,
              })}
            >
              <span className="sor-code-editor__line-number" aria-hidden="true">
                {index + 1}
              </span>
              {/* zero width space gives empty lines (and a trailing new line) height */}
              {line || '\u200b'}
            </span>
            {index < lines.length - 1 && '\n'}
          </span>
        )
      })
  }

  return (
    <div
      id={`${name}-form-group`}
      className={cx('govuk-form-group lbh-form-group', {
        'govuk-form-group--error': Boolean(error),
      })}
    >
      <label className="govuk-label lbh-label" htmlFor={name}>
        {label}
      </label>
      {hint && (
        <span id={`${name}-hint`} className="govuk-hint lbh-hint">
          {hint}
        </span>
      )}
      {error && (
        <div id={`${name}-error`}>
          <ErrorMessage label={error.message} />
        </div>
      )}
      <Editor
        className={cx('sor-code-editor', {
          'sor-code-editor--error': Boolean(error),
        })}
        textareaId={name}
        name={name}
        value={value}
        onValueChange={onValueChange}
        highlight={highlight}
        padding={{ top: 10, right: 10, bottom: 10, left: 48 }}
        textareaClassName="sor-code-editor__textarea"
        ignoreTabKey
      />
    </div>
  )
}

export default SorCodeEditor
