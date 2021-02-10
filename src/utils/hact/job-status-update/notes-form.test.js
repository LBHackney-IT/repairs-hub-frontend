import { buildNoteFormData } from './notes-form'

describe('buildNoteFormData', () => {
  const formData = {
    workOrderReference: '10233332',
    note: 'Leak has gone everywhere',
  }

  it('builds the notes to post to the JobStatusUpdate endpoint in Repairs API', async () => {
    const jobStatusUpdateFormData = {
      relatedWorkOrderReference: {
        id: '10233332',
      },
      comments: 'Leak has gone everywhere',
      typeCode: '0',
      otherType: 'addNote',
    }

    const response = buildNoteFormData(formData)
    expect(response).toEqual(jobStatusUpdateFormData)
  })
})
