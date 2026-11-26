export type CautionaryAlert = {
  type: string
  comments: string
  startDate: string
  endDate: string
  // Only set on specific requirements alerts
  reason?: string
}

export type CautionaryAlertsResponse = {
  reference: string
  alerts: CautionaryAlert[]
}
