import { render } from '@testing-library/react'
import PhotoViewList from './PhotoViewList'

describe('PhotoViewList component', () => {
  it('renders nothing when photos are null', () => {
    const { asFragment } = render(<PhotoViewList photos={null} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders list of photos', () => {
    const photos = [
      {
        id: 153,
        groupLabel: 'Closing work order',
        uploadedBy:
          'Uploaded by Dennis Reynolds (dennis.reynolds@hackney.gov.uk)',
        timestamp: '2024-08-21T13:21:37.059487Z',
        description: '',
        files: ['/mockfilepath/photo_3.jpg', '/mockfilepath/photo_2.jpg'],
      },
      {
        id: 152,
        groupLabel: 'Uploaded directly to work order',
        uploadedBy: 'Uploaded by Test Test (test.test@hackney.gov.uk)',
        timestamp: '2024-07-25T06:30:37.059487Z',
        description: 'Some description',
        files: [
          '/mockfilepath/photo_1.jpg',
          '/mockfilepath/photo_2.jpg',
          '/mockfilepath/photo_3.jpg',
        ],
      },
    ]

    const { asFragment } = render(<PhotoViewList photos={photos} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders edit description form', () => {
    const photos = [
      {
        id: 153,
        groupLabel: 'Closing work order',
        uploadedBy:
          'Uploaded by Dennis Reynolds (dennis.reynolds@hackney.gov.uk)',
        timestamp: '2024-08-21T13:21:37.059487Z',
        description: '',
        files: ['/mockfilepath/photo_3.jpg', '/mockfilepath/photo_2.jpg'],
      },
      {
        id: 152,
        groupLabel: 'Uploaded directly to work order',
        uploadedBy: 'Uploaded by Test Test (test.test@hackney.gov.uk)',
        timestamp: '2024-07-25T06:30:37.059487Z',
        description: 'Some description',
        files: [
          '/mockfilepath/photo_1.jpg',
          '/mockfilepath/photo_2.jpg',
          '/mockfilepath/photo_3.jpg',
        ],
      },
    ]

    const { asFragment } = render(
      <PhotoViewList
        photos={photos}
        onSubmitSetDescription={() => {}}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
