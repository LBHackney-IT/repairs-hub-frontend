import { render } from '@testing-library/react'
import {
  UpdateDescriptionButton,
  UpdateDescriptionForm,
} from './PhotoGroupDescriptionForm'

describe('UpdateDescriptionButton component', () => {
  it('renders UpdateDescriptionButton component with no description', () => {
    const { asFragment } = render(
      <UpdateDescriptionButton
        description={''}
        showForm={() => {}}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders UpdateDescriptionButton component with description', () => {
    const { asFragment } = render(
      <UpdateDescriptionButton
        description={'Some description'}
        showForm={() => {}}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders UpdateDescriptUpdateDescriptionFormonButton component with no description', () => {
    const { asFragment } = render(
      <UpdateDescriptionForm
        description={''}
        onSubmit={() => {}}
        fileGroupId={1}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders UpdateDescriptUpdateDescriptionFormonButton component with description', () => {
    const { asFragment } = render(
      <UpdateDescriptionForm
        description={'Some description'}
        onSubmit={() => {}}
        fileGroupId={1}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
