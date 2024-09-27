import { render } from '@testing-library/react'
import NoteEntry from './NoteEntry'
import Operatives from '../Operatives'

describe('NoteEntry component', () => {
  it('should render note with image (repairs online)', () => {
    const props = {
      note: {
        note: 'Image from user: http://example-url/',
        time: new Date('2021-01-23T16:28:57.17811'),
        user: 'Test user',
        userEmail: 'sample@sample.com',
        noteGeneratedOnFrontend: false,
        typeCode: '3',
        otherType: 'some type',
      },
    }

    const { asFragment } = render(
      <NoteEntry note={props.note} workOrder={{}} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render a normal note', () => {
    const props = {
      note: {
        note: 'some pre-generated note',
        time: new Date('2021-01-23T16:28:57.17811'),
        user: 'Test user',
        userEmail: 'sample@sample.com',
        noteGeneratedOnFrontend: false,
        typeCode: '3',
        otherType: 'some type',
      },
    }

    const { asFragment } = render(
      <NoteEntry note={props.note} workOrder={{}} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render a completed work order note', () => {
    const props = {
      note: {
        note: 'comments left by user',
        time: new Date('2021-01-23T16:28:57.17811'),
        user: 'Test user',
        userEmail: 'sample@sample.com',
        noteGeneratedOnFrontend: true,
        typeCode: '0',
        otherType: 'completed',
      },
      workOrder: {
        closedDated: '2021-01-23T16:28:57.17811',
        operatives: [
          {
            name: 'Steve',
            jobPercentage: 15,
          },
        ],
        paymentType: 'Bonus',
      },
    }

    const { asFragment } = render(
      <NoteEntry note={props.note} workOrder={props.workOrder} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
