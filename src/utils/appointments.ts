type AvailableSlotsForDate = {
  date: string
  slots: { description: string; reference: string }[]
}

export const getAvailableSlots = (
  date: Date,
  availableSlots: AvailableSlotsForDate[]
): AvailableSlotsForDate | undefined => {
  const slots = availableSlots.find(
    (slot) => new Date(slot.date).getTime() == date.getTime()
  )

  return slots
}

export const getAppointmentReference = (
  availableSlots: AvailableSlotsForDate,
  selectedSlot: string
): string => {
  const reference = availableSlots['slots'].find(
    (slot) => slot['description'].split(' ')[0] == selectedSlot.split(' ')[0]
  )

  return reference.reference
}
