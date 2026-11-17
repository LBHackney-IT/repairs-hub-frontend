import { ReactNode } from 'react'

interface Props {
  width: string
  children?: ReactNode
  className?: string
}

const GridColumn = ({ width, children, className }: Props) => (
  <div
    className={
      className
        ? `govuk-grid-column-${width} ${className}`
        : `govuk-grid-column-${width}`
    }
  >
    {children}
  </div>
)

export default GridColumn
