import { render } from '@testing-library/react'
import UploadPhotosForm from './UploadPhotosForm'

describe('UploadPhotosForm component', () => {
  it('renders component', () => {
    const { asFragment } = render(
      <UploadPhotosForm workOrderReference="1234" onSuccess={() => {}} />
    )
    expect(asFragment()).toMatchSnapshot()
  })


})
