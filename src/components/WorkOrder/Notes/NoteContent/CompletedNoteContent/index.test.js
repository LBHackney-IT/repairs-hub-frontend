import { render } from '@testing-library/react'
import CompletedNoteContent from '.'

describe('CompletedNoteContent component', () => {
  it('should match snapshot when user comment is empty', () => {
    const workOrder = {
      closedDate: new Date('2024-09-26T12:34:56'), // Replace with actual date fixture
      paymentType: 'Bonus',
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: '' }

    const { asFragment } = render(
      <CompletedNoteContent note={note} workOrder={workOrder} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when user comment is not empty', () => {
    const workOrder = {
      closedDate: new Date('2024-09-26T12:34:56'), // Replace with actual date fixture
      paymentType: 'Bonus',
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent note={note} workOrder={workOrder} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when no operative', () => {
    const workOrder = {
      closedDate: new Date('2024-09-26T12:34:56'), // Replace with actual date fixture
      paymentType: 'Bonus',
      operatives: [],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent note={note} workOrder={workOrder} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when one operative', () => {
    const workOrder = {
      closedDate: new Date('2024-09-26T12:34:56'), // Replace with actual date fixture
      paymentType: 'Bonus',
      operatives: [{ name: 'Operative Name', jobPercentage: 50 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent note={note} workOrder={workOrder} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when multiple operatives', () => {
    const workOrder = {
      closedDate: new Date('2024-09-26T12:34:56'), // Replace with actual date fixture
      paymentType: 'Bonus',
      operatives: [
        { name: 'Operative One', jobPercentage: 50 },
        { name: 'Operative Two', jobPercentage: 50 },
      ],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent note={note} workOrder={workOrder} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when payment type is Bonus', () => {
    const workOrder = {
      closedDate: new Date('2024-09-26T12:34:56'), // Replace with actual date fixture
      paymentType: 'Bonus',
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent note={note} workOrder={workOrder} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when payment type is Close to Base', () => {
    const workOrder = {
      closedDate: new Date('2024-09-26T12:34:56'), // Replace with actual date fixture
      paymentType: 'CloseToBase',
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent note={note} workOrder={workOrder} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when payment type is Overtime', () => {
    const workOrder = {
      closedDate: new Date('2024-09-26T12:34:56'), // Replace with actual date fixture
      paymentType: 'Overtime',
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent note={note} workOrder={workOrder} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when payment type is null', () => {
    const workOrder = {
      closedDate: new Date('2024-09-26T12:34:56'), // Replace with actual date fixture
      paymentType: null,
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent note={note} workOrder={workOrder} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when further work required', () => {
    const workOrder = {
      closedDate: new Date('2024-09-26T12:34:56'), // Replace with actual date fixture
      paymentType: null,
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
      followOnRequest: {
        id: 31,
        isSameTrade: true,
        isDifferentTrades: true,
        requiredFollowOnTrades: ['Carpentry', 'Drainage'],
        isMultipleOperatives: true,
        followOnTypeDescription: 'work required',
        stockItemsRequired: true,
        nonStockItemsRequired: true,
        materialNotes: 'materials required',
        additionalNotes: 'additioanl notes',
      },
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent note={note} workOrder={workOrder} />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
