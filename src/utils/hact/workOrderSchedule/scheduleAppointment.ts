export const buildScheduleAppointmentData = (
  workOrderReference: string,
  appointmentReference: string
) => {
  return {
    workOrderReference: {
      id: parseInt(workOrderReference),
      description: '',
      allocatedBy: '',
    },
    appointmentReference: {
      id: appointmentReference,
      description: '',
      allocatedBy: '',
    },
  }
}
