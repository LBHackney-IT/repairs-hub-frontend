export const buildScheduleAppointmentData = (
  workOrderReference,
  appointmentReference
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
