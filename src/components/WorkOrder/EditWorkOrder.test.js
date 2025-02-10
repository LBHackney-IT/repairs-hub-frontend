import { render } from '@testing-library/react'
import BackButton from '../Layout/BackButton'
import { GridColumn, GridRow } from '../Layout/Grid'
import CharacterCountLimitedTextArea from '../Form/CharacterCountLimitedTextArea'
import { PrimarySubmitButton, Button } from '../Form'

const mockHandleSubmit = jest.fn()
const mockOnCancel = jest.fn()
const mockOnSubmit = jest.fn()
const mockRegister = jest.fn()

const mockWorkOrder = {
  reference: 10000040,
  description: 'Wick new',
  dateRaised: '2022-05-04T14:19:56.693963Z',
  lastUpdated: null,
  priority: '2 [E] EMERGENCY',
  property: '1 Hackney',
  owner: 'Herts Heritage Ltd',
  propertyReference: '00100033',
  target: '2022-05-05T14:19:56.294Z',
  raisedBy: 'Neil van Beinum Test',
  callerNumber: '01234567890',
  callerName: 'name',
  priorityCode: 2,
  status: 'Variation Approved',
  contractorReference: 'HHL',
  tradeCode: 'CN',
  tradeDescription: 'Concrete Work - CN',
  appointment: null,
  operatives: [],
  action: 'Unknown',
  externalAppointmentManagementUrl: null,
  canAssignOperative: false,
  closedDated: null,
  plannerComments: null,
  totalSMVs: 5376,
  isSplit: false,
  isOvertime: false,
  multiTradeWorkOrder: false,
  paymentType: '',
  budgetCode: null,
  startTime: null,
  followOnRequest: null,
  uploadedFileCount: {
    totalFileCount: 0,
  },
  workOrderCanBeAddedToDrs: false,
}

describe('EditWorkOrder Component', () => {
  it('should render correctly', () => {
    const { asFragment } = render(
      <div className="govuk-!-display-none-print">
        <BackButton />
        <GridRow>
          <GridColumn width="two-thirds">
            <h1 className="lbh-heading-h1 display-inline ">
              {`Edit work order: ${mockWorkOrder.reference
                .toString()
                .padStart(8, '0')}`}
            </h1>
            <form
              role="form"
              id="edit-description-form"
              onSubmit={mockHandleSubmit(mockOnSubmit)}
            >
              <CharacterCountLimitedTextArea
                name="editRepairDescription"
                label="Repair description"
                required
                maxLength={230}
                requiredText="Please enter a repair description"
                register={mockRegister}
                defaultValue={mockWorkOrder.description}
                currentLength={230 - mockWorkOrder.description.length}
              />
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  label="Cancel"
                  type="button"
                  isSecondary
                  onClick={mockOnCancel}
                />
                <PrimarySubmitButton style={{ margin: '0' }} label="Save" />
              </div>
            </form>
          </GridColumn>
        </GridRow>
      </div>
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
