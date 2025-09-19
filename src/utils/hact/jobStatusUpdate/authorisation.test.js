import {
  buildVariationAuthorisationApprovedFormData,
  buildVariationAuthorisationRejectedFormData,
  buildAuthorisationApprovedFormData,
  buildAuthorisationRejectedFormData,
} from './authorisation'

const workOrderReference = '00012345'

describe('Authorisation for a variation request', () => {
  describe('buildVariationAuthorisationApprovedFormData', () => {
    it('builds the WorkOrderUpdate form data to post to the Repairs API', () => {
      const authorisationJobFormData = {
        relatedWorkOrderReference: {
          id: '00012345',
        },
        typeCode: '100-20',
      }

      const response =
        buildVariationAuthorisationApprovedFormData(workOrderReference)

      expect(response).toEqual(authorisationJobFormData)
    })
  })

  describe('buildVariationAuthorisationRejectedFormData', () => {
    it('builds the WorkOrderUpdate form data to post to the Repairs API', () => {
      const formData = {
        note: 'Can not approve it',
      }
      const authorisationJobFormData = {
        relatedWorkOrderReference: {
          id: '00012345',
        },
        comments: 'Variation rejected: Can not approve it',
        typeCode: '125',
      }

      const response = buildVariationAuthorisationRejectedFormData(
        formData,
        workOrderReference
      )

      expect(response).toEqual(authorisationJobFormData)
    })
  })
})

describe('Authorisation for a new work order', () => {
  describe('buildAuthorisationApprovedFormData', () => {
    it('builds the approved authorisation request for the JobStatusUpdate endpoint in the Repairs API', () => {
      const authorisationJobFormData = {
        relatedWorkOrderReference: {
          id: '00012345',
        },
        typeCode: '23',
      }

      const response = buildAuthorisationApprovedFormData(workOrderReference)

      expect(response).toEqual(authorisationJobFormData)
    })
  })

  describe('buildAuthorisationRejectedFormData', () => {
    const formData = {
      note: 'This is far too expensive!',
    }

    it('builds the approved authorisation request for the JobStatusUpdate endpoint in the Repairs API', () => {
      const authorisationJobFormData = {
        relatedWorkOrderReference: {
          id: '00012345',
        },
        comments: 'Authorisation rejected: This is far too expensive!',
        typeCode: '22',
      }

      const response = buildAuthorisationRejectedFormData(
        formData,
        workOrderReference
      )

      expect(response).toEqual(authorisationJobFormData)
    })
  })
})
