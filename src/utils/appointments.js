export const getAvailableSlots = (date, availableSlots) => {
  const slots = availableSlots.find(
    (slot) => new Date(slot.date).getTime() == date.getTime()
  )

  return slots
}

export const getAppointmentReference = (availableSlots, selectedSlot) => {
  const reference = availableSlots['slots'].find(
    (slot) => slot['description'].split(' ')[0] == selectedSlot.split(' ')[0]
  )

  return reference.reference
}
