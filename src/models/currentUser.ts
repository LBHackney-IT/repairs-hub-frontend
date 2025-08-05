export interface CurrentUser {
  sub: string
  name: string
  email: string
  varyLimit: string
  raiseLimit: string
  contractors: any[] // Adjust!
  operativePayrollNumber: string | null
  isOneJobAtATime: boolean
}
