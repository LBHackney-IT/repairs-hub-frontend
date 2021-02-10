import { render } from '@testing-library/react'
import NotesForm from './NotesForm'

describe('NotesForm component', () => {
  const props = {
    tabName: 'notes',
    workOrderReference: '10002222',
    onFormSubmit: jest.fn(),
    showForm: jest.fn(),
  }

  it('should render properly when display form is false', () => {
    const { asFragment } = render(
      <NotesForm
        tabName={props.tabName}
        workOrderReference={props.workOrderReference}
        onFormSubmit={props.onFormSubmit}
        showForm={props.showForm}
        displayForm={false}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render properly when display form is true', () => {
    const { asFragment } = render(
      <NotesForm
        tabName={props.tabName}
        workOrderReference={props.workOrderReference}
        onFormSubmit={props.onFormSubmit}
        showForm={props.showForm}
        displayForm={true}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
