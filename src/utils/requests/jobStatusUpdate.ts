import { frontEndApiRequest } from '../frontEndApiClient/requests'
import { buildNoteFormData } from '../hact/jobStatusUpdate/notesForm'
import { buildOperativeAssignmentFormData } from '../hact/jobStatusUpdate/assignOperatives'
import { buildVariationFormData } from '../hact/jobStatusUpdate/variation'
import {
  buildAuthorisationApprovedFormData,
  buildAuthorisationRejectedFormData,
  buildVariationAuthorisationApprovedFormData,
  buildVariationAuthorisationRejectedFormData,
} from '../hact/jobStatusUpdate/authorisation'

// Every job status update body is produced by one of the HACT builders
export type JobStatusUpdateData =
  | ReturnType<typeof buildNoteFormData>
  | ReturnType<typeof buildOperativeAssignmentFormData>
  | ReturnType<typeof buildVariationFormData>
  | ReturnType<typeof buildAuthorisationApprovedFormData>
  | ReturnType<typeof buildAuthorisationRejectedFormData>
  | ReturnType<typeof buildVariationAuthorisationApprovedFormData>
  | ReturnType<typeof buildVariationAuthorisationRejectedFormData>

export const postJobStatusUpdateRequest = (requestData: JobStatusUpdateData) =>
  frontEndApiRequest({
    method: 'post',
    path: `/api/jobStatusUpdate`,
    requestData,
  })
