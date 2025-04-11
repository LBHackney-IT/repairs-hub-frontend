import { render } from '@testing-library/react'
import CompletedNoteContent from '.'

describe('CompletedNoteContent component', () => {
  it('should match snapshot when user comment is empty', () => {
    const workOrder = {
      closedDated: '2024-09-26T12:34:56',
      paymentType: 'Bonus',
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: '' }

    const { asFragment } = render(
      <CompletedNoteContent
        note={note}
        workOrder={workOrder}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when user comment is not empty', () => {
    const workOrder = {
      closedDated: '2024-09-26T12:34:56',
      paymentType: 'Bonus',
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent
        note={note}
        workOrder={workOrder}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when no operative', () => {
    const workOrder = {
      closedDated: '2024-09-26T12:34:56',
      paymentType: 'Bonus',
      operatives: [],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent
        note={note}
        workOrder={workOrder}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when one operative', () => {
    const workOrder = {
      closedDated: '2024-09-26T12:34:56',
      paymentType: 'Bonus',
      operatives: [{ name: 'Operative Name', jobPercentage: 50 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent
        note={note}
        workOrder={workOrder}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when multiple operatives', () => {
    const workOrder = {
      closedDated: '2024-09-26T12:34:56',
      paymentType: 'Bonus',
      operatives: [
        { name: 'Operative One', jobPercentage: 50 },
        { name: 'Operative Two', jobPercentage: 50 },
      ],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent
        note={note}
        workOrder={workOrder}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when payment type is Bonus', () => {
    const workOrder = {
      closedDated: '2024-09-26T12:34:56',
      paymentType: 'Bonus',
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent
        note={note}
        workOrder={workOrder}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when payment type is Close to Base', () => {
    const workOrder = {
      closedDated: '2024-09-26T12:34:56',
      paymentType: 'CloseToBase',
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent
        note={note}
        workOrder={workOrder}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when payment type is Overtime', () => {
    const workOrder = {
      closedDated: '2024-09-26T12:34:56',
      paymentType: 'Overtime',
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent
        note={note}
        workOrder={workOrder}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when payment type is null', () => {
    const workOrder = {
      closedDated: '2024-09-26T12:34:56',
      paymentType: null,
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent
        note={note}
        workOrder={workOrder}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when user has uploaded photos', () => {
    const workOrder = {
      closedDated: '2024-09-26T12:34:56',
      paymentType: 'Bonus',
      operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
      uploadedFileCount: {
        totalFileCount: 8,
      },
    }
    const note = { note: 'User comment' }

    const { asFragment } = render(
      <CompletedNoteContent
        note={note}
        workOrder={workOrder}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  describe('When further work is required', () => {
    it('should show the type of work', () => {
      const workOrder = {
        closedDated: '2024-09-26T12:34:56',
        paymentType: null,
        operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
        followOnRequest: {
          id: 31,
          isSameTrade: true,
          isDifferentTrades: true,
          requiredFollowOnTrades: ['Carpentry', 'Drainage'],
          isMultipleOperatives: true,
          followOnTypeDescription: 'work required',
          stockItemsRequired: false,
          nonStockItemsRequired: false,
          materialNotes: null,
          additionalNotes: null,
        },
      }
      const note = { note: 'User comment' }

      const { asFragment } = render(
        <CompletedNoteContent
          note={note}
          workOrder={workOrder}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    it('should show materials', () => {
      const workOrder = {
        closedDated: '2024-09-26T12:34:56',
        paymentType: null,
        operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
        followOnRequest: {
          id: 31,
          isSameTrade: true,
          isDifferentTrades: false,
          requiredFollowOnTrades: [],
          isMultipleOperatives: false,
          followOnTypeDescription: 'work required',
          stockItemsRequired: true,
          nonStockItemsRequired: true,
          materialNotes: 'some description about materials',
          additionalNotes: null,
        },
      }
      const note = { note: 'User comment' }

      const { asFragment } = render(
        <CompletedNoteContent
          note={note}
          workOrder={workOrder}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    it('should show additional notes', () => {
      const workOrder = {
        closedDated: '2024-09-26T12:34:56',
        paymentType: null,
        operatives: [{ name: 'Operative Name', jobPercentage: 100 }],
        followOnRequest: {
          id: 31,
          isSameTrade: true,
          isDifferentTrades: false,
          requiredFollowOnTrades: [],
          isMultipleOperatives: false,
          followOnTypeDescription: 'work required',
          stockItemsRequired: false,
          nonStockItemsRequired: false,
          materialNotes: null,
          additionalNotes: 'Some additonal notes about the work required',
        },
      }
      const note = { note: 'User comment' }

      const { asFragment } = render(
        <CompletedNoteContent
          note={note}
          workOrder={workOrder}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
