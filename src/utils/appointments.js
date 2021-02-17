export const getAvailableSlots = (date, availableSlots) => {
  const slots = availableSlots.find(
    (slot) => new Date(slot.date).getTime() == date.getTime()
  )
  return slots
}
