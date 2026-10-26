import { ReactNode } from 'react'

interface Props {
  className?: string
  id?: string
  children?: ReactNode
}

const GridRow = (props: Props) => (
  <div className={`govuk-grid-row ${props.className}`} id={props.id}>
    {props.children}
  </div>
)

export default GridRow
