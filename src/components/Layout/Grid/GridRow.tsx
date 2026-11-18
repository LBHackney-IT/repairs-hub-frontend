import { ReactNode } from 'react'

interface Props {
  children?: ReactNode
  className?: string
  id?: string
}

const GridRow = ({ children, className, id }: Props) => (
  <div
    className={className ? `govuk-grid-row ${className}` : 'govuk-grid-row'}
    id={id}
  >
    {children}
  </div>
)

export default GridRow
