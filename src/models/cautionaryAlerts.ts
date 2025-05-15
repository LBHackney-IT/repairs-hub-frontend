export type CautionaryAlert = {
  type: string
  comments: string
  startDate: string
  endDate: string
}

export type CautionaryAlertsResponse = {
  reference: string
  alerts: CautionaryAlert[]
}
