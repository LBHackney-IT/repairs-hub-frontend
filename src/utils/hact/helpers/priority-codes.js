import {
  IMMEDIATE_PRIORITY_CODE,
  EMERGENCY_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
} from '../../helpers/priorities'

export const priorityCodeCompletionTimes = {
  [IMMEDIATE_PRIORITY_CODE]: {
    numberOfHours: 2,
    numberOfDays: 0,
  },
  [EMERGENCY_PRIORITY_CODE]: {
    numberOfHours: 24,
    numberOfDays: 1,
  },
  [URGENT_PRIORITY_CODE]: {
    numberOfHours: 120,
    numberOfDays: 5,
  },
  [NORMAL_PRIORITY_CODE]: {
    numberOfHours: 504,
    numberOfDays: 21,
  },
  // inspection ?
  // 5: {
  //   numberOfHours: 8670,
  //   numberOfDays: 365,
  // },
}
