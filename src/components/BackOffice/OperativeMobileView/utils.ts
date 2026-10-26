export interface HubOperative {
  id: number
  sub: string
  name: string
  email: string
  varyLimit: string
  raiseLimit: string
  contractors: string[]
  operativePayrollNumber: string
  isOneJobAtATime: boolean
}

export const filterOperatives = (
  operatives: HubOperative[],
  operativeFilter: string
) => {
  if (!operativeFilter) return operatives
  operativeFilter = operativeFilter.toLowerCase()
  return operatives.filter(
    (x) =>
      x.id?.toString().includes(operativeFilter) ||
      x.name?.toLowerCase().includes(operativeFilter) ||
      x.operativePayrollNumber?.toLowerCase().includes(operativeFilter)
  )
}
