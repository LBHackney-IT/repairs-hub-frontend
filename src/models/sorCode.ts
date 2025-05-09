class SorCode {
  id: string
  code: string
  cost: number
  standardMinuteValue: number
  description: string

  constructor(
    id: string,
    code: string,
    cost: number,
    standardMinuteValue: number,
    description: string
  ) {
    this.id = id
    this.code = code
    this.cost = cost
    this.standardMinuteValue = standardMinuteValue
    this.description = description
  }
}

export default SorCode
