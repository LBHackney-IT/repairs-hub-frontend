import { render } from '@testing-library/react'
import UploadPhotosForm from './UploadPhotosForm'
import PhotoUploadPreview from './PhotoUploadPreview'
import { mockFile } from './helpers'

describe('PhotoUploadPreview component', () => {
  beforeAll(() => {
    global.URL = {
      createObjectURL: jest.fn(() => 'mockResponseUrl'),
    }
  })

  it('renders component', () => {
    const files = [mockFile('file.png')]

    const { asFragment } = render(<PhotoUploadPreview files={files} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
