import { render } from '@testing-library/react'
import PhotoListWithPreview from './PhotoListWithPreview'

describe('PhotoListWithPreview component', () => {
  it('renders component', () => {
    const { asFragment } = render(
      <PhotoListWithPreview fileUrls={['url1', 'url2', 'url3']} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
