import { ReactNode } from 'react'
import { GridRow, GridColumn } from '../Layout/Grid'
import BackButton from '../Layout/BackButton'

interface Props {
  workOrderReference: string | number
  children?: ReactNode // e.g. the work order action menu
}

const WorkOrderPageHeading = ({ workOrderReference, children }: Props) => (
  <>
    <BackButton />

    <GridRow>
      <GridColumn width="two-thirds">
        <h1 className="lbh-heading-h1 display-inline govuk-!-margin-right-6">
          Work order: {workOrderReference.toString().padStart(8, '0')}
        </h1>
      </GridColumn>
      <GridColumn width="one-third">{children}</GridColumn>
    </GridRow>
  </>
)

export default WorkOrderPageHeading
