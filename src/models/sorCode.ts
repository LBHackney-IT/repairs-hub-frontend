class SorCode {
  id: string
  code: string
  cost: number
  standardMinuteValue: number
  shortDescription: string
  longDescription: string

  constructor(
    id: string,
    code: string,
    cost: number,
    standardMinuteValue: number,
    shortDescription: string,
    longDescription: string
  ) {
    this.id = id
    this.code = code
    this.cost = cost
    this.standardMinuteValue = standardMinuteValue
    this.shortDescription = shortDescription
    this.longDescription = longDescription
  }
}

export default SorCode
