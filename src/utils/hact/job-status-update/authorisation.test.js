import {
  buildAuthorisationApprovedFormData,
  buildAuthorisationRejectedFormData,
} from './authorisation'

describe('buildAuthorisationApprovedFormData', () => {
  const workOrderReference = '00012345'
  it('builds the UpdateJob form data to post to the Repairs API', () => {
    const authorisationJobFormData = {
      relatedWorkOrderReference: {
        id: '00012345',
      },
      typeCode: '100-20',
    }

    const response = buildAuthorisationApprovedFormData(workOrderReference)

    expect(response).toEqual(authorisationJobFormData)
  })
})

describe('buildAuthorisationRejectedFormData', () => {
  const workOrderReference = '00012345'
  const formData = {
    note: 'Can not approve it',
  }
  it('builds the UpdateJob form data to post to the Repairs API', () => {
    const authorisationJobFormData = {
      relatedWorkOrderReference: {
        id: '00012345',
      },
      comments: 'Variation rejected: Can not approve it',
      typeCode: '125',
    }

    const response = buildAuthorisationRejectedFormData(
      formData,
      workOrderReference
    )

    expect(response).toEqual(authorisationJobFormData)
  })
})
