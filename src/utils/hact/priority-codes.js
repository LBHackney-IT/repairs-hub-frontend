export const mapPriorityCodeToHact = {
  1: {
    numberOfHours: 2,
    numberOfDays: 0,
    priorityCodeHact: 1,
  },
  2: {
    numberOfHours: 24,
    numberOfDays: 1,
    priorityCodeHact: 1,
  },
  3: {
    numberOfHours: 168,
    numberOfDays: 7,
    priorityCodeHact: 2,
  },
  4: {
    numberOfHours: 720,
    numberOfDays: 30,
    priorityCodeHact: 3,
  },
  5: {
    numberOfHours: 8760,
    numberOfDays: 365,
    priorityCodeHact: 4,
  },
}

export const calculateRequiredCompletionDateTime = (hours) => {
  if (!hours) {
    console.error('No argument given')
    return null
  }

  let currentDateTime = new Date()
  return new Date(currentDateTime.getTime() + hours * 3600000)
}
