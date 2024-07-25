import { render } from '@testing-library/react'
import ControlledFileInput from './ControlledFileInput'
import { mockFile } from './helpers'

jest.mock(
  './hooks/useUpdateFileInput',
  jest.fn((files, inputRef) => {
    inputRef.current.value = ''
  })
)

describe('ControlledFileInput component', () => {
  beforeAll(() => {
    global.URL = {
      createObjectURL: jest.fn(() => 'mockResponseUrl'),
    }
  })

  it('renders component when no files selected', () => {
    const { asFragment } = render(
      <ControlledFileInput
        files={[]}
        setFiles={() => {}}
        validationError={null}
        isLoading={false}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders shows file previews', () => {
    const file = mockFile('test.png')

    const { asFragment } = render(
      <ControlledFileInput
        files={[file]}
        setFiles={() => {}}
        validationError={null}
        isLoading={false}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders shows validation error', () => {
    const file = mockFile('test.png')

    const { asFragment } = render(
      <ControlledFileInput
        files={[file]}
        setFiles={() => {}}
        validationError={'Some validation error'}
        isLoading={false}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
