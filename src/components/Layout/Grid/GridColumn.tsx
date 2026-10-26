import { ReactNode } from 'react'

interface Props {
  width: string
  children?: ReactNode
  className?: string
}

const GridColumn = (props: Props) => {
  const className = props.className
    ? `govuk-grid-column-${props.width} ${props.className}`
    : `govuk-grid-column-${props.width}`

  return <div className={className}>{props.children}</div>
}

export default GridColumn
