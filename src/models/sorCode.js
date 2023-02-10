class SorCode {
  id
  code
  cost
  standardMinuteValue
  shortDescription
  longDescription

  constructor(
    id,
    code,
    cost,
    standardMinuteValue,
    shortDescription,
    longDescription
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
