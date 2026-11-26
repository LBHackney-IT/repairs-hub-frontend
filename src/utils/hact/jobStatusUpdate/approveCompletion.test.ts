import { buildApproveCompletionFormData } from './approveCompletion'

describe('buildApproveCompletionFormData', () => {
  it('builds the approval to post to the JobStatusUpdate endpoint in Repairs API', () => {
    const response = buildApproveCompletionFormData(
      '10233332',
      'Certificate checked'
    )

    expect(response).toEqual({
      relatedWorkOrderReference: {
        id: '10233332',
      },
      comments: 'Certificate checked',
      typeCode: '0',
      otherType: 'approveCompletion',
    })
  })

  it('trims whitespace from the note', () => {
    const response = buildApproveCompletionFormData(
      '10233332',
      '  Certificate checked  '
    )

    expect(response.comments).toBe('Certificate checked')
  })

  it('uses an empty comment when no note is given', () => {
    const response = buildApproveCompletionFormData('10233332')

    expect(response.comments).toBe('')
  })

  it('uses an empty comment when the note is only whitespace', () => {
    const response = buildApproveCompletionFormData('10233332', '   ')

    expect(response.comments).toBe('')
  })
})
