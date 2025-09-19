import { render } from '@testing-library/react'
import TruncateText from '.'

describe('TruncateText component', () => {
  const props = {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  }

  it('should render truncate text, with truncate line of 3', () => {
    const { asFragment } = render(
      <TruncateText text={props.text} numberOfLines="3" />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render truncate text, with truncate line of 5', () => {
    const { asFragment } = render(
      <TruncateText text={props.text} numberOfLines="5" />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
